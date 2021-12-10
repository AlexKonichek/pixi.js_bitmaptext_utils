<template>
  <div>
    <div class="row m-3">
      <div>
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
      XMLFileName: "",
      scale: "",
      charCodeArr:[],
      XMLText:"",
      font: 'font family',
      xOffset:null,
      xoffsetForSymbolCorrectingXAdvance:0,
      yOffset:null,
      arrSymbolsParams:[],
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
    '$store.state.isDataReadyForXMLCreator': function () {
      this.prepareDataForXML()
    }
  },

  computed: {
    xadvanceForSpaceSymbol() {
      return Math.floor(this.xadvanceCurrent * 0.25)
    },
    xadvanceForTabSymbol() {
      return Math.floor(this.xadvanceCurrent * 0.7)
    }
  },
  methods: {
     prepareDataForXML() {
      this.fillCharcodeArr()
      let data = this.$store.state.jsonData
      this.XMLFileName = Object.values(data)[1].image
      this.scale = Object.values(data)[1].scale
      this.font = Object.values(data)[1].image.split(".")[0]
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

    fillCharcodeArr() {
      this.charCodeArr = []
      this.$store.state.inputSymbolsArr.forEach(symbol => {
        this.charCodeArr.push(symbol.charCodeAt(0))
      })
    },
    showPreview(){
      this.showPreviewComponent = true
    },

    JSON2XML() {
      this.arrSymbolsParams = []
      //first part of XML file
      this.XMLText = `
<font>
  <info face="${this.font}" size="${this.$store.state.arrSymbolsHeights[0]}" />
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
        if(this.$store.state.currentXadvance) {
          //case when general xadvance is changed
          console.log(this.$store.state.currentXadvance)
          this.xOffsetCurrent = (this.$store.state.currentXadvance - symbolWidth)
        } else {

          //case when general xadvance not touched(default)
          console.log(this.$store.state.currentXadvance)
          this.xOffsetCurrent = (this.$store.getters.xadvance- symbolWidth)

        }
       // this.xOffsetCurrent = (Number(this.xadvanceCurrent)- symbolWidth) /2
        //this.yOffsetCurrent = (Number(this.yadvanceCurrent)- symbolHeight) /2
        this.yOffsetCurrent = 0
        if(this.$store.state.inputSymbolsArr[index] === this.$store.state.symbolForCorrectingXOffset){
            this.xoffsetForSymbolCorrectingXAdvance = this.xOffset
        } 
            
            let row = `    <char id="${this.charCodeArr[index]}" x="${x}" y="${y}" width="${symbolWidth}" height="${symbolHeight}" xoffset="${this.xOffsetCurrent}" yoffset="${this.yOffsetCurrent}" xadvance="${this.xadvanceCurrent}" /><!-- ${this.$store.state.inputSymbolsArr[index]} -->\n`
              this.XMLText += row

               let symbolsParams = {
                  index,
                  symbol:this.$store.state.inputSymbolsArr[index],
                  xoffset:this.xOffsetCurrent,
                  width:frame.w,
                  height:frame.h,
                  x:frame.x,
                  y:frame.y
              }
              this.arrSymbolsParams.push(symbolsParams)
              
        });
  
      //end part of XML file
      this.XMLText += `    <char id="32" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${this.xadvanceForSpaceSymbol}" /><!--   -->\n`
      this.XMLText += `    <char id="9" x="0" y="0" width="0" height="0" xoffset="0" yoffset="0" xadvance="${this.xadvanceForTabSymbol}" /><!--       -->\n`
      this.XMLText += `  </chars>
        <kernings count="0">
        </kernings>
        </font>`
      this.$store.commit("setArrSymbolsParams", this.arrSymbolsParams)  
    } 
  },
  mounted() {
     this.prepareDataForXML()
  }
}

</script>
