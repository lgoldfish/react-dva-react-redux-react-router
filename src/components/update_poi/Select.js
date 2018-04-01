import React, { Component } from "react";
import { connect } from "dva";
import { getRequest } from "../../server/server";
import Api from "../../server/apiConfig";
import { message } from "antd";
import {ngrmap } from "./Mapview"
import { Link } from 'dva/router';
import openImage from "../../assets/open2.png"
class Selecter extends Component {
  constructor(props) {
    super(props);
    this.getInputValue = this.getInputValue.bind(this);
    this.selectedMap = this.selectedMap.bind(this);
  }
  state = {
    selectedBuild: 0,
    selectedFloor: 0
  };
  componentWillMount(){
    this.props.dispatch({
      type: "mapInfo/maplist",
      payload: { updatepoiBuilding:[] }
    });
    this.props.dispatch({
      type: "mapInfo/maplist",
      payload: { updatepoiFloors: [] }
    });
    this.props.dispatch({
      type: "mapInfo/maplist",
      payload: { mapName:"" }
    });
  }
  getInputValue(e) {
    let value = this.refs.mapId.value;
    let url = Api.mapApi + "PoiInfo/maps";
    getRequest(url, { query: value }).then(mapList => {
      this.props.dispatch({
        type: "mapInfo/maplist",
        payload: { mapList }
      });
      if (mapList&&mapList.length === 0) {
        message.info("sorry 没有相关信息");
        this.props.dispatch({
          type: "mapInfo/maplist",
          payload: { updatepoiBuilding: [] }
        });
        this.props.dispatch({
          type: "mapInfo/maplist",
          payload: { updatepoiFloors: [] }
        });
        this.props.dispatch({
          type: "mapInfo/maplist",
          payload: { mapName: "" }
        });
        this.props.dispatch({
          type: "mapInfo/showmap",
          payload: { showfloorInfo: "" }
        });
      }
    });
  }
  selectedMap(val) {
    this.setState({
      selectedFloor: 0,
      selectedBuild: 0
    });
    this.props.dispatch({
      type: "mapInfo/maplist",
      payload: { mapList: [] }
    });
    let url = `${Api.mapApi}PoiInfo/${val.mapid}/builds`;
    getRequest(url).then(builds => {
      let updatepoiBuilding = [];
      for (let key in builds) {
        updatepoiBuilding.push(key);
      }
      this.props.dispatch({
        type: "mapInfo/maplist",
        payload: { updatepoiBuilding }
      });
      this.props.dispatch({
        type: "mapInfo/maplist",
        payload: { updatepoiFloors: Array.from(Object.values(builds)[0]) }
      });
      this.props.dispatch({
        type: "mapInfo/maplist",
        payload: { mapName: val.showname }
      });
      this.props.dispatch({
        type: "mapInfo/showmap",
        payload: { showfloorInfo: Object.values(builds)[0][0] }
      });
    });
  }
  selectedBuild(val, i) {
    this.setState({
      selectedBuild: i
    });
  }
  showSelectedMap(val, i) {
    this.setState({
      selectedFloor: i
    });
    this.props.dispatch({
      type: "mapInfo/showmap",
      payload: { showfloorInfo: val }
    });
    let flooridUrl = `${Api.mapApi}PoiInfo/${val.floorid}/area`
    ngrmap.mapView.getSource("highlight").setData({
      type: "FeatureCollection",
      features:[]
     })
    getRequest(flooridUrl).then((featureCollection)=>{
      ngrmap.mapView.getSource("highchange").setData({
        type: "FeatureCollection",
        features:featureCollection.features.filter((val,i)=>{
          return val.properties.ischange == 1;
      }) 
    })
    })
    if(ngrmap.mapView.popups){
      window.Log("popup", ngrmap.mapView.popups)
      ngrmap.mapView.popups.forEach(val => {
        val.remove()
      });
      ngrmap.mapView.popups.length = 0
    }
  // this.props.dispatch({
  //   type: "mapInfo/changeFloor",
  //   payload: { isChangeFloor:true }
  // });
  }
  render() {
    return (
      <div className="select">
        <div className="search_box">
          <input
            name="mapid"
            placeholder="请输入MapId/场所名称进行搜索"
            ref="mapId"
          />
          <button onClick={this.getInputValue} className="search_button">
            搜 索
          </button>
          <span className="mapName">{this.props.mapName}</span>
          <div className="navitocheckpoi">
            <Link  to="/check">进入审核页面</Link>
          </div>
        </div>
        <div className="search_result">
          <div className="building_list">
           {
             this.props.updatepoiBuilding.length ? <span>building:</span> : <img className="openImage" src={openImage}/>
           }
            <ul>
              {this.props.updatepoiBuilding.map((val, i) => {
                return (
                  <li
                    onClick={this.selectedBuild.bind(this, val, i)}
                    className={
                      i == this.state.selectedBuild ? "activeSelectedFloor" : ""
                    }
                    key={i}
                  >
                    {val}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="floors_list">
          {!this.props.updatepoiFloors?<span>floors:</span>:""}
            <ul>
              {this.props.updatepoiFloors.map((val, i) => {
                return (
                  <li
                    onClick={this.showSelectedMap.bind(this, val, i)}
                    className={
                      i == this.state.selectedFloor ? "activeSelectedFloor" : ""
                    }
                    key={i}
                  >
                    {val.nameen}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="mapList">
          {this.props.mapList.length ? (
            <ul>
              <li>
                <span>mapId</span>
                <span>mapName</span>
              </li>
              {this.props.mapList.map((val, i) => {
                return (
                  <li key={i} onClick={this.selectedMap.bind(this, val)}>
                    <span>{val.mapid}</span> <span>{val.showname}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ mapInfo }) => {
  return {
    updatepoiBuilding: mapInfo.updatepoiBuilding,
    updatepoiFloors: mapInfo.updatepoiFloors,
    mapName: mapInfo.mapName,
    mapList: mapInfo.mapList,
    isChangeFloor:mapInfo.isChangeFloor
  };
};

export default connect(mapStateToProps)(Selecter);
