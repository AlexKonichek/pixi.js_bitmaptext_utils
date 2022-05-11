<template>
  <div class="h-100">
    <div class="h-100 d-flex flex-column">
      <div class="row flex-grow-1 bg-secondary">
        <div class="col-lg-3 mr-3 bg-secondary">
          <SidePanel v-show="showSidePanel"/>
        </div>
        <div class="col-lg-9 ml-3">
          <OpenFile v-if="showOpenFile"
                    @json="loadedJSON = $event"
                    @image="loadedPNG = $event"
                    @getImgUrl="imgUrl = $event"
          ></OpenFile>
          <div v-if="this.$store.state.showFrameNamesOrderMessage">
            <h2><b>Please, put symbols in right order or select it from selector under symbols form</b></h2>
            <ul>
              <li v-for="(symbol, index) in symbols" :key="symbol">
                <b>{{index}} - {{symbol}}</b>
              </li>
            </ul>
          </div>
          <div class="row">
            <div class="h-75">
              <XML_Creator v-if="showXMLCreator"/>
            </div>
          </div>

        </div>
      </div>
      <div class="row flex-grow-1">
        <div class="bg-secondary">
          <ShowDemo v-if="this.$store.state.showCanvas"/>
        </div>
      </div>
    </div>

  </div>
</template>
<script>

import OpenFile from "./OpenFile";
import ShowDemo from "./ShowDemo.vue";
import XML_Creator from "./XML-Creator";
import SidePanel from "./SidePanel"
import FinalPreview from "./FinalPreview.vue"

export default {
  components: {OpenFile, XML_Creator, SidePanel, ShowDemo},
  data() {
    return {
      arrSmallSumbolIndexesForRenderer:[],
      symbolParamsForCorrectingXOffset:{
        symbol:"S",
        width:0,
        x:0,
        y:0
      },
      textures:[],
      maxSymbolHeight:null,
      frameNamesArr: [],
      isDataReady:false,
      xAdvance:null,
      allowToCreateXML: false,
      finalSmallXAdvance: null,
      finalXAdvance:null,
      font: 'font family',
      comaOrDotExist: false,
      showLetterSpacing: false,
      checkedLetterSpasing: false,
      checkedSpriteBorder: false,
      charCodesAndNamesArr: [],
      charCodeArr: [],
      changeXAdvance: 0,
      changeYAdvance: 0,
      coordinatesArr: [],
      comaAndDotWidthsArr: [],
      currentXAdvance: 0,
      dotXAdvance: 0,
      comaXAdvance: 0,
      showModal:false,
      showPreviewButton:false,
      showCreateXMLButton:false,
      showXadvanceForSmallSymbols:false,
      showImagePreview:false,
      showOpenFile:true,
      showSidePanel:false,
      
      showRenderButton: false,
      showBorderCheckbox: false,
      showLetterSpacingModeCheckbox: false,
      showShiftX: false,
      showTextArea: false,
      showFrameNamesOrderMessage:false,
      symbols:[],
      symbolsArr: [],
      symbolParams:[],
      symbolsMap:[],
      sourceSizeW: 0,
      sourceSizeH: 0,
      showRenderer: false,
      framesWidths: [],
      framesNames: [],
      //inputSymbols: ",.0123456789×",
      inputSymbols: "",
      maxWidth: 1,
      maxSymbolWidthFromJSON: 0,
      maxSmallSymbolWidthFromJSON: 0,
      maxSymbolWidth: undefined,
      maxSmallSymbolWidth: undefined,
      maxWidthReady: false,
      framesArr:[],
      JSONFile: {},
      XMLText: '',
      XMLFileName: '',
      xoffset: 0,
      yoffset: 0,
      yadvance: 0,
      imgUrl:null,
      comaParams: {},
      dotIndex:0,
      symbolForCorrectingXOffset:"S"
    }
  },
  watch: {
    
    textures: function () {
      this.createSymbolsMap()
    },
    symbolParams: function () {
      this.createSymbolsMap()
    },
    '$store.state.loadedJSON': function () {
      this.showOpenFile = false
      this.createShowFrameNameOrderList()
      this.showImagePreview = true
      this.showSidePanel = true

    },
    '$store.state.loadedPNG': function () {
      this.showImagePreview = true
      this.getSymbolsOrder()
    },
    

    maxSymbolWidth: function () {
      this.finalXAdvance = Number(this.maxSymbolWidth)

    },
    maxSmallSymbolWidth: function () {
      this.finalSmallXAdvance = Number(this.maxSmallSymbolWidth)
    },

    charCodeArr: function () {
      this.charCodeArr.forEach((charCode, i) => {
        let charCodeAndName = {[charCode]: this.framesNames[i]}
        this.charCodesAndNamesArr.push(charCodeAndName)
      })
    },

  },
  computed: {
    showXMLCreator() {
      return this.$store.state.isDataReadyForXMLCreator
    },
    
    maxSymbolHeightModel: {
      set(value) {
        this.maxSymbolHeight = value;
      },
      get() {
        return Math.max(...this.arrSymbolsHeights)
      }
    } 

  },
  methods: {
     getSymbolsOrder(){
         let data = JSON.parse(this.$store.state.loadedJSON)
         this.$store.commit("setJSONData", data)
         let frames = Object.values(data)[0]
         this.symbols = Object.keys(frames).map(key => {return key.split(".")[0];})
        
     },
     createSymbolsMap(){
       console.warn("createSymbolsMap",this.symbolParams, this.textures)
       if((this.symbolParams.length>0) && (this.textures.length > 0)){
        
        let symbolsMap = new Map();
        this.symbolParams.forEach(symbol=> {
          this.textures.forEach(texture => {
            if((symbol.x === texture.frame.x) && (symbol.y === texture.frame.y)){
                let params = {
                  name:symbol.name,
                  texture:texture,
                  xoffset:symbol.xoffset,
                  width:symbol.width,
                }
                symbolsMap.set(symbol.name, params)
            }
          })
        })
         this.symbolsMap = symbolsMap

       }else{
         console.warn("data is not ready",this.symbolParams, this.textures )
       }
      
        
    },
    
    createShowFrameNameOrderList() {
      this.$store.commit("setShowFrameNamesOrderMessage", true)

    },

   
    CreateXML() {
     
    },
  
     isAllReady() {
      console.warn("isAllReady")
      this.showCreateXMLButton = true
      
      //if(this.maxSymbolWidth===undefined) { this.finalXAdvance = this.xadvance } 
     // else { this.finalXAdvance = this.maxSymbolWidth }
     // if(this.maxSmallSymbolWidth===undefined) { this.finalSmallXAdvance = this.xadvanceSmall } 
     // else { this.finalSmallXAdvance = this.maxSmallSymbolWidth }

    //  if(this.finalXAdvance>0 && this.loadedJSON && this.symbolsArr.length>0 && this.arrSymbolsWidths.length>0){
        
    //    console.warn("data is ready")
   //   }else {
    //      throw new Error("data is not ready")}

    },
    
  
  }
}
</script>
<style>
.height75 {
  height: 75vh;
}
.height25 {
  height: 25vh;
}

ul {
    list-style: none;
  }
</style>
