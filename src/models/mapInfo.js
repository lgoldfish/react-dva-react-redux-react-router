export default {
    namespace: 'mapInfo',
    state: {
        mapName:"",
        updatepoiBuilding: [],
        updatepoiFloors: [],
        mapList:[],
        showfloorInfo:{},
        features:[],//选中的POI信息
        isChangeFloor:false,//监控是否在切换楼层
        poilistRadio:false
    }, 
    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
      },
    
      effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          yield put({ type: 'save' });
        },
      },
    reducers: {
        maplist(state, { payload }) {
            return { ...state, ...payload };
        },
        showmap(state,{ payload }){
            return {...state,...payload}
        },
        getFeatures(state,{payload}){
            return {...state,...payload}
        },
        // 清空选中的POI信息
        changeFloor(state,{payload}){
            return {...state,...payload}
        },
        //点击地图 清除list radio
        poilistRadio(state,{payload}){
            return {...state,...payload}
        }
    }
}