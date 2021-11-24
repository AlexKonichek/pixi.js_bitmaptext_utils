<template>
  <div>
    <div class="row m-3">
      <div class="col-sm-6">
        <!-- <button  v-if="showPreviewButton" class="btn btn-success btn-lg m-3"  v-on:click="showPreview">Show preview</button> -->
        <!-- <Preview v-if="showPreviewComponent"
            :arrSymbolsParams="arrSymbolsParams"
            :textures="textures"
            :symbolsMap="symbolsMap"
        /> -->
      </div>
      <div  class="col-sm-6">
        <div class="form-group">
          <label class="h4 text-dark" for="XML">XML</label>
          <textarea class="form-control" id="XML" v-model="XMLText" rows="28" cols="50"></textarea>
          <button class="btn btn-success btn-lg m-3"  v-on:click="this.downloadXML">Save XML</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import Preview from "./Preview";

export default {
  name: "XML_Creator",
  components: {},
  data() {
    return {
      comaOrDotExist:false,
      XMLFileName: "",
      scale: "",
      smallSymbolsWidthsArr: [],
      framesArr: [],
      framesWidths: [],
      framesHeights: [],
      coordinatesArr:[],
      charCodeArr:[],
      XMLText:"",
      font: 'font family',
      maxWidthReady: false,
      symbols: this.inputSymbols,
      showTextArea:false,
      xOffset:null,
      xoffsetForSymbolCorrectingXAdvance:0,
      yOffset:null,
      arrSymbolsParams:[],
      showPreviewComponent:false,

      xadvanceCurrent:null,
      yadvanceCurrent:null,
      xOffsetCurrent:null,
      yOffsetCurrent:null,
    }
  },
 
  watch: {
    '$store.state.currentXadvance': function () {
      this.JSON2XML()
    },
    '$store.state.currentSmallXadvance': function () {
      this.JSON2XML()
    },

    /* xoffsetForSymbolCorrectingXAdvance: function(){
      this.$emit("xOffsetForRendererChange",this.xoffsetForSymbolCorrectingXAdvance)
    },
    xOffset: function () {
      console.log("xOffset:",this.xOffset)
      this.$emit("xOffsetChange",this.xOffset)
    },
    
    finalXAdvance: function () {
      this.xadvanceCurrent = Number(this.finalXAdvance)
      console.log("finalXAdvance change in xml creator", this.xadvanceCurrent)

    },
    finalSmallXAdvance: function () {
      console.log("finalSmallXAdvance change in xml creator", this.finalSmallXAdvance)
      this.JSON2XML()
    },
    symbolsArr: function () {
      console.log("symbolsArr in XML-creatore is changed")
      this.fillCharcodeArr()
      this.JSON2XML()
    }, */
    '$store.state.isDataReadyForXMLCreator': function () {
      console.log("dataReady")
      this.prepareDataForXML()
      
    }
  },
  computed: {},
  methods: {
     prepareDataForXML() {
      console.warn("XML-creator:prepareDataForXML")
      this.fillCharcodeArr()
      let data = this.$store.state.jsonData
      this.XMLFileName = Object.values(data)[1].image
      this.scale = Object.values(data)[1].scale
      this.font = Object.values(data)[1].image.split(".")[0]
      //this.yadvance = this.maxSymbolHeightFromJSON() 

      this.JSON2XML()
  
    },
    downloadXML() {
      let xmltext = this.XMLText;
      let name = this.XMLFileName.split('.')[0]
      let filename = `${name}.xml`;
      let pom = document.createElement('a');
      let bb = new Blob([xmltext], {type: 'text/plain'});
      pom.setAttribute('href', window.URL.createObjectURL(bb));
      pom.setAttribute('download', filename);
      pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
      pom.draggable = true;
      pom.classList.add('dragout');
      pom.click();
    },

    maxSymbolHeightFromJSON() {
      return Math.max(...this.framesHeights)
    },

    fillCharcodeArr() {
      this.charCodeArr = []
      this.$store.state.inputSymbolsArr.forEach(symbol => {
        this.charCodeArr.push(symbol.charCodeAt(0))
        console.log()
      })
      console.log("fillCharcodeArr:", this.charCodeArr )
    },
    showPreview(){
      this.showPreviewComponent = true
    },

    JSON2XML() {
      this.arrSymbolsParams = []

      
      console.warn("JSON2XML",this.$store.state.arrSymbolsHeights[0]);
      //first part of XML file
      this.XMLText = `
<font>
  <info face="${this.font}" size="size" />
  <common lineHeight="${this.$store.state.arrSymbolsHeights[0]}" scaleW="494" scaleH="479" pages="1" />
  <pages>
    <page id="0" file="${this.font}.png" />
  </pages>
  <chars count="${this.$store.getters.framesArrLength + 2}">\n`
    
      this.$store.state.framesArr.forEach(({frame, sourceSize, spriteSourceSize}, index) => {
          let symbolWidth = frame.w;
          let symbolHeight = frame.h;
          let x = frame.x;
          let y = frame.y;
            //define xadvance for dot,comma or similar small symbol
            //to do add arr of all possibly small symbols and checking if it have a current symbols
            if((this.$store.state.inputSymbolsArr[index] === "," || this.$store.state.inputSymbolsArr[index] === ".")) {
                this.xadvanceCurrent = this.$store.state.currentSmallXadvance === null ? this.$store.getters.xadvanceSmall: this.$store.state.currentSmallXadvance
                this.$store.commit("setJSONHasSmallSymbols", true)
                this.yadvanceCurrent = undefined
                }

              //define xadvance for plain symbols
              else {
              this.xadvanceCurrent = this.$store.state.currentXadvance === null ? this.$store.getters.xadvance : this.$store.state.currentXadvance
              this.yadvanceCurrent = undefined
              }
        this.xOffsetCurrent = (Number(this.xadvanceCurrent)- symbolWidth) /2
        this.yOffsetCurrent = (Number(this.yadvanceCurrent)- symbolHeight) /2

            /* if(this.symbolsArr[index] === this.symbolForCorrectingXOffset){
              this.xoffsetForSymbolCorrectingXAdvance = this.xOffset
            } */
            

            let row = `    <char id="${this.charCodeArr[index]}" x="${x}" y="${y}" width="${symbolWidth}" height="${symbolHeight}" xoffset="${this.xOffsetCurrent}" yoffset="${this.yOffsetCurrent}" xadvance="${this.xadvanceCurrent}" /><!-- ${this.$store.state.inputSymbolsArr[index]} -->\n`
              this.XMLText += row

              /* let symbolsParams = {
                  name:this.symbolsArr[index],
                  xoffset:this.xOffset,
                  width:frame.w,
                  height:frame.h,
                  x:frame.x,
                  y:frame.y
              }
              this.arrSymbolsParams.push(symbolsParams) */
        });
      //this.$emit("symbolParamsIsReady",this.arrSymbolsParams)

      //end part of XML file
      this.XMLText += `    <char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${this.xadvanceCurrent * 0.25}" /><!--   -->\n`
      this.XMLText += `    <char id="9" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${this.xadvanceCurrent * 0.7}" /><!--       -->\n`
      this.XMLText += `  </chars>
        <kernings count="0">
        </kernings>
        </font>`
    } 
  }
}

</script>
