import Style from "./style";
// import mapboxgl from "mapbox-gl"
import Api from "../server/apiConfig"
let defaultOptions = {
    style:Style,
    container:"map",
    zoom:19
}
class NgrMap extends  mapboxgl.Evented {
  constructor() {
    super();
  }
  async initMap(options){
    let o ;
    if(options){
      o = {...defaultOptions,...options}
    }else{
      o = defaultOptions
    }
    this.mapView = new mapboxgl.Map(o)
  }
  async changeFloor(mapInfo,checkpage){
    if(mapInfo){
      const {floorid , center} = {...mapInfo}
      let Style = this.mapView.getStyle()
      // if(checkpage == "checkpage"){
        Style.sources.Area.data = `${Api.mapApi}/PoiInfo/${floorid}/changedarea`
      // }else{
        // Style.sources.Area.data = `${Api.mapApi}/PoiInfo/${floorid}/area`
      // }
      Style.sources.Frame.data = `${Api.mapApi}/PoiInfo/${floorid}/frame`
      Style.sources.Facility.data = `${Api.mapApi}/PoiInfo/${floorid}/facility`
      this.mapView.setStyle(Style)
      this.mapView.setCenter(center)
      this.mapView.resize();
    }else {
      this.mapView.setCenter([0,0])
    }
  }
}
export default NgrMap 
