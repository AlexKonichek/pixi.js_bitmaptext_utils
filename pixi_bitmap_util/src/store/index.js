import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    arrSymbolsWidths:[],
    arrSymbolsHeights:[],
    arrSmallSymbolsWidth:[],
    arrSmallSymbolsHeights:[],
    arrSymbolsParams:[],
    loadedJSON: null,
    loadedPNG: null,
    jsonData:null,
    framesArr:[],
    inputSymbolsArr:[],
    isTrimmed: false,
    isDataReadyForXMLCreator:false,
    showCreateXMLButton:false,
    showInputError:false,
    showCanvas:false,
    showFrameNamesOrderMessage:false,
    textures:[],
    currentXadvance:null,
    currentSmallXadvance:null,
    jsonHasSmallSymbols:false,
    firstLetterForCorrectingXOffset:"U",
    secondLetterForCorrectingXOffset:"S",
    thirdLetterForCorrectingXOffset:"D",
    digitsSymbolForCorrectingXOffset: "0",
    symbolForCorrectingXOffsetSmall:",",

    // firstLetterParamsForCorrectingXOffset:{
    //   symbol:"U",
    //   width:0,
    //   x:0,
    //   y:0
    // },
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
    },
    firstLetterForCanvas:state => {
      return state.arrSymbolsParams.find(item => item.symbol === "U")
    },
    secondLetterForCanvas:state => {
      return state.arrSymbolsParams.find(item => item.symbol === state.secondLetterForCorrectingXOffset)
    },
    thirdLetterForCanvas:state => {
      return state.arrSymbolsParams.find(item => item.symbol === state.thirdLetterForCorrectingXOffset)
    },
    canvasWidths: state => {
      return Math.max(...state.arrSymbolsWidths) * 3
    },
    canvasHeight: state => {
      return Math.max(...state.arrSymbolsHeights)
    }

    // secondSymbolXoffsetForCanvas:state => {
    //   return state.arrSymbolsParams.find(item => item.symbol === state.symbolForCorrectingXOffset)
    // },
    // secondSmallSymbolXoffsetForCanvas:state => {
    //   return state.arrSymbolsParams.find(item => item.symbol === state.symbolForCorrectingXOffsetSmall)
    // },
    // comaParams:state => {
    //   return state.arrSymbolsParams.find(item => item.symbol === ",")
    // }

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
    setJSONHasSmallSymbols: (state, value) => state.jsonHasSmallSymbols = value,
    setShowInputError: (state, value) => state.showInputError = value,
    setTextures: (state, value) => state.textures = value,
    setSymbolParamsForCorrectingXOffset: (state, value) => state.symbolParamsForCorrectingXOffset = value,
    setShowCanvas:(state, value) => state.showCanvas = value,
    setArrSymbolsParams:(state, value) => state.arrSymbolsParams = value,
    setSymbolForCorrectingXOffset:(state, value) => state.firstLetterForCorrectingXOffset = value,
    setShowFrameNamesOrderMessage:(state, value) => state.showFrameNamesOrderMessage = value,

  },
  actions: {
  },
  modules: {
  }
})
export default store;