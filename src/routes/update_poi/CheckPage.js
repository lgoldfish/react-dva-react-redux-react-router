import React, { Component } from "react";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
import { Link } from 'dva/router';
import { getRequest ,postRequest } from "../../server/server";
import Api from "../../server/apiConfig";
import { message , Modal, Button } from "antd";
import NgrMap from "../../map_sdk/ngrmap"
import {Table} from "antd"
import {columns} from "./checkTable_columns"
import openImage from "../../assets/open2.png"
export let ngrmap = new NgrMap()
class CheckPage extends Component  {
    constructor(props){
        super(props)
        this.getInputValue = this.getInputValue.bind(this);
        this.selectedMap = this.selectedMap.bind(this);
        this.checkpass = this.checkpass.bind(this)
        this.floorPass = this.floorPass.bind(this)
    }
    componentDidMount(){
        ngrmap.initMap({container:"map_check"})
    }
    state = {
        selectedBuild: 0,
        selectedFloor: 0,
        showname:"",
        mapid:"",
        mapList:[],
        buildings:[],
        floors:[],
        features:[],
        pagination: {
            defaultPageSize: 20,
            size: "small",
            showSizeChanger: true
          },
          total: 0,
        currentbdid:0,  
        currentfloor:0,
    }
    checkpass(){
        window.Log("审核通过")
        if(this.state.currentbdid == 0){
            message.info("没有要提交的数据")
            return
        }
        let url = `${Api.mapApi}/PoiInfo/AuditBuild`
        let data = {
            bdid:this.state.currentbdid,
            description:"",
            userid:"勒是雾都"
        }
        postRequest(url,data).then((res)=>{
            window.Log("checkpass ok",res)
            switch (res.status){
                case 200 :  message.info("提交成功")
                this.setState({
                    showname:"",
                    buildings:[],
                    floors:[]
                })
                ngrmap.changeFloor()
                 break;
                case 400 :  message.info("参数错误")  
                 break;
                case 403 :  message.info("有未通过审核的POI")  
                 break;
                case 403 :  message.info("不存在的bdid")  
                 break;             
                 default:message.info("提交失败"+res.status + res.statusText)  
            }
        })
    }
    floorPass(){
        if(this.state.currentfloor == 0){
            message.info("没有需审核的数据")
            return
        }
        let url = `${Api.mapApi}/PoiInfo/AuditPoiByFloorId`
        let data =this.state.currentfloor
        console.log("data is",data)
        postRequest(url,data).then((res)=>{
            window.Log(" res ",res)
            if(res.status == 200){
                message.info("提交成功")
                this.setState({
                    features:[],
                    floors:this.state.floors.map((val,i)=>{
                        if(val.floorid == this.state.currentfloor){
                            val.ischange = 2
                        }
                        return val
                    })
                })

            }else if(res.status == 404) {
                message.info("本楼层没有修改的项")
            }else if(res.status == 400) {
                message.info("参数错误")
            }else {
                message.info("提交错误"+ res.status + res.statusText)
            }
        })
    }
    getInputValue(e) {
        let value = this.refs.mapId.value;
        let url = Api.mapApi + "PoiInfo/ChangedMaps";
        getRequest(url, { query: value }).then(mapList => {
            this.setState({mapList})
            window.Log("maplist ",this.state.mapList)
          if (mapList&&mapList.length === 0) {
            message.info("sorry 没有相关信息");        
          }
        });
      }
    selectedMap(val) {
        this.setState({
          selectedFloor: 0,
          selectedBuild: 0
        });
        let url = `${Api.mapApi}PoiInfo/${val.mapid}/builds`;
        getRequest(url).then(builds => {
            window.Log("val is",val)
            window.Log("builds is",builds)
            let buildings = [];
            for (let key in builds) {
                buildings.push(key);
            }
            let floors = Object.values(builds)[0].filter((val,i)=>{
                return val.ischange == 1 || val.ischange == 2
            })
            window.Log("ischange floors",floors)
            this.setState({buildings,floors,mapList:[],showname:val.showname,
                selectedFloor: 0,selectedBuild: 0,currentbdid:buildings[0],currentfloor:floors[0].floorid})
            window.Log("floorid is",floors[0])
            let flooridUrl = `${Api.mapApi}PoiInfo/${floors[0].floorid}/area`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            getRequest(flooridUrl).then((featureCollection)=>{
                window.Log("featureCollection is",featureCollection)
                let changedFeatures = featureCollection.features.filter((val,i)=>{
                    return val.properties.ischange == 1 && val.properties.isaudit !=1;
                }) 
                window.Log("changeFeature ",changedFeatures)
                this.setState({features:changedFeatures.map((val,i)=>{
                    return {
                        id:val.properties.id,
                        display:val.properties.display,
                        newdisplay:val.properties.newdisplay,
                        newcategoryid:val.properties.newcategoryid,
                        newcategoryname:val.properties.newcategoryname,
                        geometry:val.geometry,
                        center:val.properties.center,    
                        key:i
                    }
                })})
                ngrmap.mapView.getSource("highchange").setData({
                    type: "FeatureCollection",
                     features: featureCollection.features.filter((val,i)=>{
                        return val.properties.ischange == 1 ;
                    }) 
                })  
                ngrmap.changeFloor(floors[0],"checkpage")
            })
          });
    }
    selectedBuild(val, i) {
        this.setState({
          selectedBuild: i
        });
      }
      showSelectedMap(val, i) {
        window.Log("val is",val )
        ngrmap.mapView.getSource("highlight").setData({
            type: "FeatureCollection",
            features: []})  
        ngrmap.mapView.getSource("highchange").setData({
            type: "FeatureCollection",
            features: []})  
        this.setState({
          selectedFloor: i,
          currentfloor:val.floorid
        });
        let flooridUrl = `${Api.mapApi}PoiInfo/${val.floorid}/area`
        getRequest(flooridUrl).then((featureCollection)=>{
            window.Log("featureCollection is",featureCollection)
            let changedFeatures = featureCollection.features.filter((val,i)=>{
                return val.properties.ischange == 1 && val.properties.isaudit !=1;
            }) 
            window.Log("changeFeature ",changedFeatures)
            this.setState({features:changedFeatures.map((val,i)=>{
                return {
                    id:val.properties.id,
                    display:val.properties.display,
                    newdisplay:val.properties.newdisplay,
                    newcategoryid:val.properties.newcategoryid,
                    newcategoryname:val.properties.newcategoryname,
                    geometry:val.geometry,
                    center:val.properties.center,    
                    key:i
                }
            })})
            ngrmap.mapView.getSource("highchange").setData({
                type: "FeatureCollection",
                 features: featureCollection.features.filter((val,i)=>{
                    return val.properties.ischange == 1;
                }) 
            })  
            ngrmap.changeFloor(val,"checkpage")
        })
    }
    render(){
        let that = this
        const rowSelection = {
          type:"radio",
          onChange(rowKeys, rows) {
            if(rows[0]){
                window.Log("rows is",rows)
              ngrmap.mapView.setCenter(rows[0].center)
                ngrmap.mapView.getSource("highlight").setData({
                  type: "FeatureCollection",
                  features: [
                      {
                          type: "Feature",
                          geometry:rows[0].geometry
                      }
                  ]
              })
            }else {
              message.info("地图中未找到该Feature");
            }
          }
        };
        return (
            <div>
            <div className="select ">
                <div className="search_box">
                <input name="mapid" placeholder="请输入MapId/场所名称进行搜索" ref="mapId"/>
                <button onClick={this.getInputValue} className="search_button">搜 索</button>
                <span className="mapName">{this.state.showname}</span>
                <div className="navitocheckpoi"><Link to="/">进入修改页面</Link></div>
                </div>
                <div className="search_result search_result_check ">
                <div className="building_list">
                   {this.state.buildings.length? <span>building:</span>:<img className="openImage" src={openImage}/>}
                    <ul>
                    {this.state.buildings.map((val, i) => {
                        return (
                        <li
                            onClick={this.selectedBuild.bind(this, val, i)}
                            className={ i == this.state.selectedBuild ? "activeSelectedFloor" : "" }key={i}>{val}
                        </li>
                        );
                    })}
                    </ul>
                </div>
                <div className="floors_list">
                {!this.state.floors?  <span>floors:</span>:""}
                    <ul>
                    {this.state.floors.map((val, i) => {
                        return (
                        <li
                            onClick={this.showSelectedMap.bind(this, val, i)}
                            className={i == this.state.selectedFloor ? "activeSelectedFloor" : ""}key={i}   style = {val.ischange == 2 ? {background:"#e8e8e8",border:"none"}:{background:"#ffffff"}}>{val.nameen}   
                        </li>
                        );
                    })}
                    </ul>
                </div>
                <div onClick={this.checkpass} className = "check_pass">审核通过</div>
                </div>
                <div className="mapList">
                {this.state.mapList.length ? (
                    <ul>
                    <li>
                        <span>mapId</span>
                        <span>mapName</span>
                    </li>
                    {this.state.mapList.map((val, i) => {
                        return (
                        <li key={i} onClick={this.selectedMap.bind(this, val)}>
                            <span>{val.mapid}</span> <span>{val.showname}</span>
                        </li>
                        );
                    })}
                    </ul>
                ) : ("")}
                </div>
               
            </div>
            <div className="mapview_check" >
                <div id ="map_check" style={{height:"100%"}}></div>
            </div>
            <div className="check_table" >
            <div className = "check_floor"> 
                <button onClick={this.floorPass} >本楼层通过审核</button>
                {/* <ul> 已审核通过的楼层 ：<li>B1</li> <li>B2</li></ul> */}
            </div>
             <Table
                columns={columns}
                dataSource={this.state.features}
                pagination={this.state.pagination}
                rowSelection={rowSelection}
                />
            </div>
        </div>
        )
    }
}
 
export default CheckPage