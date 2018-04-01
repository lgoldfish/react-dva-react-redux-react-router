import React, { Component } from "react";
import { connect } from "react-redux";
import { message } from "antd";
import {ngrmap } from "./Mapview"
import Api from "../../server/apiConfig";
import { getRequest ,postRequest } from "../../server/server";
class PoiUpdate extends Component {
    constructor(props){
        super(props)
        this.submitformData = this.submitformData.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.featureButtonClick = this.featureButtonClick.bind(this)
        this.selectedCategory = this.selectedCategory.bind(this)
    }
  state = {
    features: [
      // {
      //   id: "03W001F0110048",
      //   display: "停车场",
      //   shopnamecn: "停车场",
      //   shopnameen: "parking",
      //   categoryid: 2354466
      // },
      // {
      //   id: "04W444444444444",
      //   display: "王洪波",
      //   shopnamecn: "王洪波",
      //   shopnameen: "parking",
      //   categoryid: 2354466
      // }
    ],
    feature: {
      id: "",
      display: "",
      shopnamecn: "",
      shopnameen: "",
      categoryid: "",
      categoryname:""
    },
    featureNext:{
      id: "",
      display: "",
      shopnamecn: "",
      shopnameen: "",
      categoryid: "",
      categoryname:""
    },
    featureButtonIndex:0,
    categoryList:[],
    categorynameList:[],
    featureCenter:[]
  };
  componentDidMount(){
    ngrmap.mapView.popups = []
    let url =  `${Api.mapApi}/PoiInfo/CategoryList`
    getRequest(url).then(categoryList=>{
      this.setState({categoryList})
    })
  }
  componentWillReceiveProps(nextProps) {
    window.Log("nextProps",nextProps)
    if(nextProps.features[0]){
      this.state.featureCenter = nextProps.features[0].center
    }
    const { features,showfloorInfo} = this.props
    const { features : nextFeatures,showfloorInfo:nextshowfloorInfo} = nextProps;
    if(showfloorInfo.floorid != nextshowfloorInfo.floorid){
      this.setState({
        features:[],
        feature:{ 
            id: "",
            display: "",
            shopnamecn: "",
            shopnameen: "",
            categoryid: "",
            categoryname:""
          },
        featureNext:{
          id: "",
          display: "",
          shopnamecn: "",
          shopnameen: "",
          categoryid: "",
          categoryname:""
        }
      })
    }else{
      this.setState({
        features:nextFeatures,
        feature:{...nextFeatures[0]},
        featureNext:{...nextFeatures[0]}
      })
    }
  }
  submitformData(e,value){
    e.preventDefault();
    const ajaxData = {...this.state.feature,...this.state.featureNext}
    ajaxData.userid = "勒是雾都"
    window.Log(ajaxData)
    if(ajaxData.display != ajaxData.shopnamecn && ajaxData.display != ajaxData.shopnameen){
      message.info("提交失败 "+" display 字段必须跟shopnamecn 和 shopnamecn 其中一个值一致");
      return
    }
    let url = `${Api.mapApi}/PoiInfo`
    postRequest(url,ajaxData).then((res)=>{
      if(res.status == 200){
        message.info("提交成功");
        var popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(this.state.featureCenter)
        .setHTML(`<h1>${ajaxData.display}</h1>`)
        .addTo(ngrmap.mapView);
        ngrmap.mapView.popups.push(popup)
      }else {
        message.info("提交失败"+ res.statusText)
        let error = new Error (res.statusText)
        error.response = res
        throw error   
      }
    }).catch((ex)=>{
      console.log("ex is",ex)
    })
  }
  handleInputChange(e){
    const target = e.target
    const value = target.value
    const name = target.name
    const { featureNext } = this.state;
    this.setState({
        featureNext:{
            ...featureNext,[name]:value,
        }
    })
   if(name == "categoryid" ){
    this.setState(({
      categorynameList : this.state.categoryList.filter((val,i)=>{
        return String(val.categoryid).includes(String(value))
      }).slice(0,10)
    }))
   } 
  }
  featureButtonClick(index,val){
    this.setState({
      featureButtonIndex:index,
      feature:{...this.state.features[index]},
      featureNext:{...this.state.features[index]}
    })
    if(val){
      ngrmap.mapView.setCenter(val.center)
        ngrmap.mapView.getSource("highlight").setData({
          type: "FeatureCollection",
          features: [
              {
                  type: "Feature",
                  // properties: feature.properties,
                  geometry:val.geometry
              }
          ]
      })
    }else {
      message.info("地图中未找到该Feature");
    }
  }
  selectedCategory (category){
    this.setState({
      featureNext:{...this.state.featureNext,categoryid:category.categoryid,categoryname:category.categoryname},
      categorynameList:[]
    })
  }
  render() {
    return (
      <div className="poiupdate">
        <div className="featureTitle">
        {
            this.state.features.map((val,i)=>{
                return (
                    this.state.featureButtonIndex === i ?<button onClick={this.featureButtonClick.bind(this,i,val)} style ={{color:"#FFFFFF",background:"#64b5f6"}} key={i}> {val.id}</button> : <button onClick={this.featureButtonClick.bind(this,i,val)} key={i}> {val.id}</button> 
                )
            })
        }
        </div>
        <form onSubmit= {this.submitformData} className="poiupdate_form">
          <ul>
            <li>
              <span>属性名</span> <span>原属性值</span>
              <span>修改属性值</span>
            </li>
            <li>
                <span>id</span><span>{this.state.feature.id}</span><span>{this.state.feature.id}</span>
            </li>
            <li >
                <span>categoryid</span><span>{this.state.feature.categoryid}</span><span className = "categoryid"><input autoComplete="off"

name="categoryid"   onChange={this.handleInputChange} value={this.state.featureNext.categoryid} />
                 <ul className="categoryidList"> 
                 {
                   this.state.categorynameList.map((val,i)=>{
                     return (
                       <li onClick = {this.selectedCategory.bind(this,val)} key = {i}>
                         <span>{val.categoryid}</span> | <span>{val.categoryname}</span>
                       </li>
                     )
                   })
                 }
    
                </ul>
               </span>
            </li>
            <li>
                <span>shopnamecn</span><span>{this.state.feature.shopnamecn}</span><span><input name="shopnamecn" onChange={this.handleInputChange}  value={this.state.featureNext.shopnamecn} /></span>
            </li>
            <li>
                <span>shopnameen</span><span>{this.state.feature.shopnameen}</span><span><input name="shopnameen" onChange={this.handleInputChange}  value={this.state.featureNext.shopnameen}   /></span>
            </li>
            <li>
                <span>display</span><span>{this.state.feature.display}</span><span><input name="display"  onChange={this.handleInputChange} value={this.state.featureNext.display} /></span>
            </li>
          </ul>
          <span className="tips">* display 字段必须跟shopnamecn 和 shopnamecn 其中一个值一致</span>
          <button type="submit"> 提交修改 </button>
        </form>
      </div>
    );
  }
}
const mapStateToProps = ({ mapInfo }) => {
  return {
    features: mapInfo.features,
    isChangeFloor:mapInfo.isChangeFloor,
    showfloorInfo:mapInfo.showfloorInfo
  };
};

export default connect(mapStateToProps)(PoiUpdate);
