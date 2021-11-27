<template lang="html">
  <main class="bg-secondary">
    <div class="w-100 0">
      <div class="row">
        <div class="col-sm-3 mr-2">
          <SidePanel v-if="showSidePanel"/>
        </div>
        <div class="col-sm-9 bg-light ml-3">
          <OpenFile v-if="showOpenFile"
                    @json="loadedJSON = $event"
                    @image="loadedPNG = $event"
                    @getImgUrl="imgUrl = $event"
          ></OpenFile>

          <div v-if="showFrameNamesOrderMessage">
            <h2><b>Please, put symbols in right order or select it from selector under symbols form</b></h2>
            <ul>
              <li v-for="symbol in symbols" :key="symbol">
                {{symbol}}
              </li>
            </ul>
          </div>
          <XML_Creator v-if="showXMLCreator"/>

           <!--  <div id="previewImage">
              <img v-if="showImagePreview" :src="imgUrl" width="500"  />
           </div>-->
          
          <button v-if="this.$store.state.showCreateXMLButton" class="btn btn-secondary m-4"  v-on:click="CreateXML">Create XML</button>
          
        </div>
      </div>
    </div>
  </main>
</template>
<script>

import OpenFile from "./OpenFile";
import Canvas from "./Canvas.vue";
import XML_Creator from "./XML-Creator";
import SidePanel from "./SidePanel"

export default {
  components: {OpenFile, XML_Creator, SidePanel },
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
      this.showFrameNamesOrderMessage = true

    },

   
    CreateXML() {
      this.$store.commit("setDataReadyForXMLCreator", true)
      this.showRenderer = true
      this.showCreateXMLButton = false
      this.$store.commit("setShowCreateXMLButton", false)
      this.showImagePreview = false
      this.showFrameNamesOrderMessage = false
     /*  if(this.arrSmallSymbolsWidth.length===0){
        this.showXadvanceForSmallSymbols = false
      } */
      
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
  ul {
    list-style: none;
  }
</style>
