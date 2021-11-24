import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    arrSymbolsWidths:[],
    arrSymbolsHeights:[],
    arrSmallSymbolsWidth:[],
    arrSmallSymbolsHeights:[],
    loadedJSON: null,
    loadedPNG: null,
    jsonData:null,
    framesArr:[],
    inputSymbolsArr:[],
    isTrimmed: false,
    isDataReadyForXMLCreator:false,
    showCreateXMLButton:false,
    currentXadvance:null,
    currentSmallXadvance:null,
    jsonHasSmallSymbols:false
  },
  getters: {
    framesArrLength: state => {
      return state.framesArr.length;
    },
    xadvance:state => {
      return Math.max(...state.arrSymbolsWidths)
    },
    xadvanceSmall:state => {
      return Math.max(...state.arrSmallSymbolsWidth)
    },
    yadvanceSmall:state => {
      return Math.max(...state.arrSmallSymbolsWidth)
    },
    yadvance:state => {
      return Math.max(...state.arrSymbolsHeights)
    }

  },
  mutations: {
    setJSON: (state, json ) => state.loadedJSON = json,
    setPNG:(state, image) => state.loadedPNG = image,
    setJSONData:(state, data) => state.jsonData = data,
    setFrames: (state, framesArr) => state.framesArr = framesArr,
    setSymbolsArr:(state, symbolsArr) => state.inputSymbolsArr = symbolsArr,
    setArrSymbolsWidths: (state, arrSymbolsWidths) => state.arrSymbolsWidths = arrSymbolsWidths,
    setArrSymbolsHeights: (state, arrSymbolsHeights) => state.arrSymbolsHeights = arrSymbolsHeights,
    setArrSmallSymbolsWidth: (state, arrSmallSymbolsWidth) => state.arrSmallSymbolsWidth = arrSmallSymbolsWidth,
    setArrSmallSymbolsHeights: (state, arrSmallSymbolsHeights) => state.arrSmallSymbolsHeights = arrSmallSymbolsHeights,
    isTrimmed: (state, trimmed) => state.isTrimmed = trimmed,
    setDataReadyForXMLCreator: (state, isDataReady)  => state.isDataReadyForXMLCreator = isDataReady,
    setShowCreateXMLButton: (state, show) => state.showCreateXMLButton = show,
    updateCurrentXadvance: (state, value) => state.currentXadvance = value,
    updateCurrentSmallXadvance: (state, value) => state.currentSmallXadvance = value,
    setJSONHasSmallSymbols: (state, value) => state.jsonHasSmallSymbols = value
  },
  actions: {
  },
  modules: {
  }
})
export default store;