import React , {Component} from "react" ;
import { connect } from 'dva';
import NgrMap from "../../map_sdk/ngrmap"
import Api from "../../server/apiConfig";
import { getRequest } from "../../server/server";
import { message } from "antd";
export let ngrmap = new NgrMap()
class MapView extends Component {
    constructor(props){
        super(props)
    }
    state = {
        allfeatures:[]
    }
    componentDidMount(){
        ngrmap.initMap()
        ngrmap.mapView.on("click","Area",(e)=>{
            window.Log("eeeee",e)
            let clickFeatures = e.features.sort((a,b)=>{
                    return b.properties.shapelevel - a.properties.shapelevel 
            })
            let featureids =  clickFeatures.map((val,i)=>{
                return val.properties.id
            })
            let featuresByState = featureids.reduce((a,b)=>{
            return  a.concat(this.state.allfeatures.filter((val,i)=>{
                return b == val.id  })) 
            },[])
            window.Log("features by State is",featuresByState)
            let feature = featuresByState[0]
            if(feature){
                ngrmap.mapView.getSource("highlight").setData({
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry:feature.geometry
                        }
                    ] 
                })
            }

            this.props.dispatch({
                type:"mapInfo/getFeatures",
                payload:{features:featuresByState}
              })
            this.props.dispatch({
                type:"mapInfo/poilistRadio",
                payload:{poilistRadio:false}
              })         
        })
    }
    componentWillReceiveProps( nextProps){
        const {showfloorInfo} = this.props
        const {showfloorInfo : nextInfo} = nextProps
        ngrmap.changeFloor(nextInfo)
        let url = `${Api.mapApi}/PoiInfo/${nextInfo.floorid}/area`;
        getRequest(url).then(features => {
            this.setState({
              allfeatures: features.features.map((val, i) => {
                return {
                  key: i,
                  id: val.properties.id,
                  display: val.properties.display,
                  shopnamecn: val.properties.shopnamecn,
                  shopnameen: val.properties.shopnameen,
                  categoryid: val.properties.categoryid,
                  categoryname: val.properties.categoryname,
                  center:val.properties.center,
                  geometry:val.geometry
                };
              })
            });
          });
    }
    render () {
        return (
            <div className="mapview">
                <div id="map" ></div> 
            </div>
        )
    }


}
const mapStateToProps = ({mapInfo})=>{
    return {
        showfloorInfo:mapInfo.showfloorInfo
    }
}
export default connect(mapStateToProps)(MapView);