import React, { Component } from "react";
import Selecter from "../../components/update_poi/Select";
import Mapview from "../../components/update_poi/Mapview";
import PoiUpdate from "../../components/update_poi/PoiUpdate";
import PoiList from "../../components/update_poi/PoiList";
import {connect} from "react-redux"
const IndexPage = (props) => (
  <div>
    <Selecter />
    <div className="bottom_container">
      <Mapview />
      <div className="bottom_right_container">
      <PoiList />
        <PoiUpdate />
      </div>
    </div>
  </div>
);
export default IndexPage;
