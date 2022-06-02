import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    arrSymbolsWidths:[],
    arrSymbolsForPreview:["0","0","0","×"],
    arrSymbolsHeights:[],
    arrSmallSymbolsWidth:[],
    arrSmallSymbolsHeights:[],
    arrSymbolsParams:[],
    loadedJSON: null,
    loadedPNG: null,
    jsonData:null,
    framesArr:[],
    fontSize: 80,
    inputSymbolsArr:[],
    isTrimmed: false,
    isDataReadyForXMLCreator:false,
    showCreateXMLButton:false,
    showInputError:false,
    showCanvas:false,
    showInitBorders:false,
    showBorders:false,
    showFrameNamesOrderMessage:false,
    showErrorInputPreview: false,
    textures:[],
    currentXadvance:null,
    currentSmallXadvance:null,
    currentSmallYadvance:0,
    currentMultiplierYoffset:0,

    jsonHasSmallSymbols:false,
    firstLetterForCorrectingXOffset:"U",
    secondLetterForCorrectingXOffset:"S",
    thirdLetterForCorrectingXOffset:"D",
    digitsSymbolForCorrectingXOffset:"0",
    comaForCorrectingXOffset:",",
    firstDigitForCorrectingXOffset:"0",
    secondDigitForCorrectingXOffset:"0",
    thirdDigitForCorrectingXOffset:"0",

    symbolForCorrectingXOffsetSmall:",",
    XMLText:"",
    downloadXMl: false

  },
  getters: {
    isBordersShowing: (state) => {
      return state.showBorders;
    },
    hasDotSymbol: (state) => {
      return state.inputSymbolsArr.includes(".");
    },
    hasCommaSymbol: (state) => {
      return state.inputSymbolsArr.includes(",");
    },
    hasMultiplierSymbol: (state) => {
      return state.inputSymbolsArr.includes("×");
    },
    getSymbolById: (state) => (id) => {
      return state.arrSymbolsParams.find(symbolParams => symbolParams.symbol === id)
    },
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
      //return Math.max(...state.arrSmallSymbolsHeights)
      return 0
    },
    initialYoffset:state => {
      return 0
    },
    yadvance:state => {
      return Math.max(...state.arrSymbolsHeights)
    },
    firstDigitForCanvas:state => {
      return state.arrSymbolsParams.find(item => item.symbol === state.firstDigitForCorrectingXOffset)
    },
    secondDigitForCanvas:state => {
      return state.arrSymbolsParams.find(item => item.symbol === state.secondDigitForCorrectingXOffset)
    },
    thirdDigitForCanvas:state => {
      return state.arrSymbolsParams.find(item => item.symbol === state.thirdDigitForCorrectingXOffset)
    },
    comaForCanvas: state => {
      return state.arrSymbolsParams.find(item => item.symbol === state.symbolForCorrectingXOffsetSmall)
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
      return Math.max(...state.arrSymbolsWidths) * 12
    },
    canvasHeight: state => {
      return Math.max(...state.arrSymbolsHeights) * 1.3
    },
    isDigits:state => {
      return state.inputSymbolsArr.includes(",")
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
    updateCurrentSmallYadvance: (state, value) => state.currentSmallYadvance = value,
    updateCurrentMultiplierYoffset: (state, value) => state.currentMultiplierYoffset = value,
    setJSONHasSmallSymbols: (state, value) => state.jsonHasSmallSymbols = value,
    setShowInputError: (state, value) => state.showInputError = value,
    setTextures: (state, value) => state.textures = value,
    setSymbolParamsForCorrectingXOffset: (state, value) => state.symbolParamsForCorrectingXOffset = value,
    setShowCanvas:(state, value) => state.showCanvas = value,
    setArrSymbolsParams:(state, value) => state.arrSymbolsParams = value,
    setSymbolForCorrectingXOffset:(state, value) => state.firstLetterForCorrectingXOffset = value,
    setShowFrameNamesOrderMessage:(state, value) => state.showFrameNamesOrderMessage = value,
    setSymbolsForPreview:(state, value) => state.arrSymbolsForPreview = value,
    setXMLText:(state, value) => state.XMLText = value,
    setShowBorders:(state, value) => state.showBorders = value,
    setShowInitBorders:(state, value) => state.showInitBorders = value,
    setDownloadXMl:(state, value) => state.downloadXMl = value,
    setShowErrorInputPreview:(state, value) => state.showErrorInputPreview = value

  },
  actions: {
  },
  modules: {
  }
})
export default store;