import React, { Component } from "react";
import { Table, Icon, Divider } from "antd";
import { connect } from "react-redux";
import Api from "../../server/apiConfig";
import { getRequest } from "../../server/server";
import { message } from "antd";
import {ngrmap } from "./Mapview"
const columns = [
  {
    title: "id",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "display",
    dataIndex: "display",
    key: "display"
  },
  {
    title: "shopnamecn",
    dataIndex: "shopnamecn",
    key: "shopnamecn"
  },
  {
    title: "shopnameen",
    dataIndex: "shopnameen",
    key: "shopnameen"
  },
  {
    title: "categoryid",
    dataIndex: "categoryid",
    key: "categoryid"
  },
  {
    title: "categoryname",
    dataIndex: "categoryname",
    key: "categoryname"
  }
];

var arr = new Array(6).fill("6");
class PoiList extends Component {
  constructor(props) {
    super(props);
    this.searchPoi = this.searchPoi.bind(this);
    this.getAllPoi = this.getAllPoi.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }
  state = {
    allfeatures: [],
    features: [],
    pagination: {
      defaultPageSize: 10,
      size: "small",
      showSizeChanger: true
    },
    total: 0,
    selectedRowKeys: []
  };
  componentWillReceiveProps(nextProps) {
    const { showfloorInfo } = this.props;
    const { showfloorInfo: nextInfo } = nextProps;
    if(nextProps.poilistRadio == false){
      this.setState({selectedRowKeys:[]})
    }
    if (nextInfo.floorid !== showfloorInfo.floorid) {
      const floorid = nextInfo.floorid;
      if (floorid) {
        let url = `${Api.mapApi}/PoiInfo/${floorid}/area`;
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
            }),
            total: features.features.length
          });
          this.setState({ features: this.state.allfeatures });
        });
      } else {
        this.setState({
          features: [],
          total: 0,
          allfeatures: []
        });
      }
    }
  }
  searchPoi() {
    let value = String(this.refs.poivalue.value);
    if (this.state.allfeatures.length) {
      this.setState({
        features: this.state.features.filter((val, i) => {
          return val.id.includes(value) || val.display.includes(value);
        })
      });
      if (this.state.features.length ===0 ) {
        message.info("未查询到该数据");
      }
    } else {
      message.info("没有数据可以查询！");
    }
  }
  getAllPoi() {
    this.refs.poivalue.value = ""
    if (this.state.allfeatures.length) {
      this.setState({
        features: this.state.allfeatures
      });
    } else {
      message.info("没有数据可以查询！");
    }
  }
  onRowClick(selectedRowKeys){

  }
  render() {
    let that = this
    const rowSelection = {
      type:"radio",
      selectedRowKeys:that.state.selectedRowKeys,
      onChange(rowKeys, rows) {
        that.setState({ selectedRowKeys:rowKeys });
        that.props.dispatch({
          type:"mapInfo/getFeatures",
          payload:{features:rows}
        })
        that.props.dispatch({
          type:"mapInfo/poilistRadio",
          payload:{poilistRadio:true}
        })
        // let mapFeature =  ngrmap.mapView.querySourceFeatures("Area", {
        //   filter: ["==","id", rows[0].id]
        // });
        // let feature = mapFeature[0]
        if(rows[0]){
          ngrmap.mapView.setCenter(rows[0].center)
            ngrmap.mapView.getSource("highlight").setData({
              type: "FeatureCollection",
              features: [
                  {
                      type: "Feature",
                      // properties: feature.properties,
                      geometry:rows[0].geometry
                  }
              ]
          })
        }else {
          message.info("地图中未找到该Feature");
        }
      },
      onSelect(record, selected, selectedRows) {
      }
    };
    return (
      <div className="poilist">
        <div className="searchPoi">
          <input
            ref="poivalue"
            placeholder=" 请输入 featureid / displayname"
          />
          <button onClick={this.searchPoi}>查询</button>{" "}
          <button onClick={this.getAllPoi}>全部</button> POI总量：<span className="poitotal">
            {this.state.total}
          </span>
        </div>
        <Table
          className="searchPoiTable"
          columns={columns}
          dataSource={this.state.features}
          pagination={this.state.pagination}
          // onRowClick = {this.onRowClick}
          rowSelection={rowSelection}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ mapInfo }) => {
  return {
    showfloorInfo: mapInfo.showfloorInfo,
    poilistRadio: mapInfo.poilistRadio
  };
};
export default connect(mapStateToProps)(PoiList);
