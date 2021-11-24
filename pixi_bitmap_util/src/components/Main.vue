<template lang="html">
  <main class="bg-secondary">
    <div class="w-100 0">
      <div class="row">
        <div class="col-sm-3 mr-2">
          <div  class="m-3">
            <div>
              <label class="text-white h4 mt-2"  for="symbols">Required symbols</label>
              <div class="input-group input-group-lg mb-2">
                <input
                    type="text"
                    id="symbols"
                    
                    class="form-control mr-3"
                    v-model="inputSymbols"
                    required
                    placeholder="paste your symbols"
                >
              </div>
            </div>
            <div v-if="showInputError" class="alert alert-danger" role="alert">
             <p> <b>Not enough symbols for parsing!</b></p>
              <p>Should be {{this.framesArr.length}}</p>

            </div>
           <div v-if="showForm">
             <label  class="label text-white h4" for="Select">Choose symbols set</label>
             <select class="form-control form-control-lg mb-2" id="Select" v-model="inputSymbols" v-on:change="chooseSymbolsHandler" >
               <option  :value="this.selectOption1">{{ this.selectOption1 }}</option>
               <option>{{ this.selectOption2 }}</option>
             </select>
           </div>
<!--            <label class="text-white h4" for="font-family">Font family</label>-->
<!--            <div class="input-group input-group-lg m-3">-->
<!--              <input-->
<!--                  type="text"-->
<!--                  id="font-family"-->
<!--                  ref="inputSymbols"-->
<!--                  class="form-control mr-3"-->
<!--                  v-model="font"-->
<!--                  required-->
<!--              >-->
<!--            </div>-->
             <label class="text-white h4" for="XAdvance">general xadvance</label>
            <div class="input-group input-group-lg mb-2">
              <input
                  id="XAdvance"
                  class="form-control mr-3"
                  ref="XAdvance"
                  v-model="maxSymbolWidthModel"
                  step="1"
                  type="number"
              >
            </div> 
            <div v-if="this.$store.state.jsonHasSmallSymbols">
              <label class="text-white h4" for="XAdvanceSmall">xadvance for "." "," and "×"</label>
              <div class="input-group input-group-lg mb-2">
                <input
                    id="XAdvanceSmall"
                    class="form-control mr-3"
                    ref="XAdvance"
                    v-model="maxSmallSymbolWidthModel"
                    step="1"
                    type="number"
                >
              </div>
            </div>
             <p>
    
  </p>
            <!-- <Canvas
               
            /> -->

            <button ref='refresh' class="btn btn-light m-3"  v-on:click="refreshPage">Clear</button>

          </div>
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

        <!--  <div id="previewImage">
            <img v-if="showImagePreview" :src="imgUrl" width="500"  />
          </div>-->
          <XML_Creator/>
          <button v-if="showCreateXMLButton" class="btn btn-secondary m-4"  v-on:click="CreateXML">Create XML</button>
          
          


        </div>
      </div>
    </div>
  </main>
</template>
<script>

import OpenFile from "./OpenFile";
import Canvas from "./Canvas.vue";
import XML_Creator from "./XML-Creator";

export default {
  components: {OpenFile, XML_Creator },
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
      selectOption1: ',.×0123456789',
      selectOption2: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      showForm:true,
      showModal:false,
      showPreviewButton:false,
      showCreateXMLButton:false,
      showXadvanceForSmallSymbols:false,
      showImagePreview:false,
      showOpenFile:true,
      showSidePanel:false,
      showInputError: false,
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
    inputSymbols: function () {
      this.symbolsArr = []
      let symbolsArr = this.inputSymbols.split("");
      this.$store.commit("setSymbolsArr", symbolsArr)
      console.warn("inputSymbols is changed", this.symbolsArr)
      this.initialParse()
      this.validateSymbolsForm()
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
    initialXadvance() {
      return this.$store.getters.xadvance
    },

    initialXadvanceSmall() {
      return this.$store.getters.xadvanceSmall
    },

    maxSmallSymbolWidthModel: {
      set(value) {
        this.$store.commit('updateCurrentSmallXadvance', value)
      },
      get() {
        return this.$store.state.currentSmallXadvance !== null ? this.$store.state.currentSmallXadvance : this.initialXadvanceSmall
      }
    },
    maxSymbolWidthModel: {
      set(value) {
        this.$store.commit('updateCurrentXadvance', value)
      },
      get() {
        return this.$store.state.currentXadvance !== null ? this.$store.state.currentXadvance : this.initialXadvance
      }
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
     increment () {
      store.commit('increment')
    },
    decrement () {
    	store.commit('decrement')
    },
     initialParse() {
         let data = this.$store.state.jsonData
         let frames = Object.values(data)[0]
         let framesArr = Object.values(frames)
         this.$store.commit('setFrames', framesArr);
         
        let trimmed = framesArr[0].trimmed
        this.$store.commit('isTrimmed', trimmed);

       
     },
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
      this.showImagePreview = false
      this.showForm =false
      this.showFrameNamesOrderMessage = false
     /*  if(this.arrSmallSymbolsWidth.length===0){
        this.showXadvanceForSmallSymbols = false
      } */
      
    },
    parseJSON() {
      console.warn("preparseJSON");
      let arrSmallSymbolsWidth = [];
      let arrSymbolsWidths = [];
      let arrSymbolsHeights = [];
      let arrSmallSymbolsHeights = [];
      let inputSymbolsArr = this.$store.state.inputSymbolsArr

      //if(!this.symbolsArr.includes(this.symbolForCorrectingXOffset)) {
       // this.symbolForCorrectingXOffset = "0"}
      
        this.$store.state.framesArr.forEach((frame, index) => {
           arrSymbolsWidths.push(frame.frame.w);
           arrSymbolsHeights.push(frame.frame.h);
            if (inputSymbolsArr[index]=== ",") {
              arrSmallSymbolsWidth.push(frame.frame.w)
              arrSmallSymbolsHeights.push(frame.frame.h)
              this.jsonHasSmallSymbols = true
            }
            if (inputSymbolsArr[index]=== ".") {
              arrSmallSymbolsWidth.push(frame.frame.w)
              arrSmallSymbolsHeights.push(frame.frame.h)
              this.jsonHasSmallSymbols = true
              this.dotIndex = index
            }
            if(inputSymbolsArr[index] === this.symbolForCorrectingXOffset) {
               this.symbolParamsForCorrectingXOffset.width = frame.frame.w
               this.symbolParamsForCorrectingXOffset.x = frame.frame.x
               this.symbolParamsForCorrectingXOffset.y = frame.frame.y
            }
            
      })
      
      this.$store.commit("setArrSymbolsHeights",arrSymbolsHeights);
      this.$store.commit("setArrSymbolsWidths",arrSymbolsWidths);
      this.$store.commit("setArrSmallSymbolsWidth",arrSmallSymbolsWidth);
      this.$store.commit("setArrSmallSymbolsHeights",arrSmallSymbolsHeights);


      this.isAllReady()
    },

    
    chooseSymbolsHandler(e) {
      console.log(e)
    },
    validateSymbolsForm() {
      let symbolsArr = this.$store.state.inputSymbolsArr
      let framesArrLength = this.$store.getters.framesArrLength
          if(framesArrLength === symbolsArr.length) {
              this.showInputError = false
              this.parseJSON()
          }else {
            this.showInputError = true
            this.showCreateXMLButton = false
          }
    },
     isAllReady() {
      console.warn("isAllReady")
      this.showCreateXMLButton = true
      this.$store.commit("setShowCreateXMLButton",true )
      //if(this.maxSymbolWidth===undefined) { this.finalXAdvance = this.xadvance } 
     // else { this.finalXAdvance = this.maxSymbolWidth }
     // if(this.maxSmallSymbolWidth===undefined) { this.finalSmallXAdvance = this.xadvanceSmall } 
     // else { this.finalSmallXAdvance = this.maxSmallSymbolWidth }

    //  if(this.finalXAdvance>0 && this.loadedJSON && this.symbolsArr.length>0 && this.arrSymbolsWidths.length>0){
        
    //    console.warn("data is ready")
   //   }else {
    //      throw new Error("data is not ready")}

    },
    refreshPage(){location.reload()}
  
  }
}
</script>
<style>
  ul {
    list-style: none;
  }
</style>
