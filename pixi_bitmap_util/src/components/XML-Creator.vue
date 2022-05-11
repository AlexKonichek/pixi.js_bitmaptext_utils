<template>
  <div style="height: 75vh">
    <div class="XML m-3">
      <div class="xml-area">
        <div class="form-group">
          <textarea class="form-control XML" id="XML" v-model="XMLText" rows="33" cols="50"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

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
      xOffsetCurrent:null,
      yOffsetCurrent:0,
    }
  },
 
  watch: {
    '$store.state.currentXadvance': function () {
      this.JSON2XML()
    },
    '$store.state.currentSmallXadvance': function () {
      this.JSON2XML()
    },

    '$store.state.currentSmallYadvance': function () {
      this.JSON2XML()
    },
    '$store.state.currentMultiplierYoffset': function () {
      this.JSON2XML()
    },
    '$store.state.isDataReadyForXMLCreator': function () {
      this.prepareDataForXML()
    },
    '$store.state.downloadXMl': function () {
      if(this.$store.state.downloadXMl) this.downloadXML();
      this.$store.commit("setDownloadXMl", false)
    },
    // XMLText: function () {
    // },
  },

  computed: {
    xadvanceForSpaceSymbol() {
      return Math.trunc(Math.max(...this.$store.state.arrSymbolsWidths)* 0.25)
    },
    xadvanceForTabSymbol() {
      return Math.trunc(Math.max(...this.$store.state.arrSymbolsWidths)* 0.7)
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
      let xmltext = this.$store.state.XMLText;
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
    JSON2XML() {
      this.arrSymbolsParams = []

      //first part of XML file
      this.XMLText = `
<font>
  <info face="${this.font}" size="${this.$store.state.fontSize}" />
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
          let yoffset = 0;

             if(this.$store.state.inputSymbolsArr[index] === "×") {
               yoffset = this.$store.state.currentMultiplierYoffset
           }

          //define xadvance for dot,comma or similar small symbol
            if((this.$store.state.inputSymbolsArr[index] === "," || this.$store.state.inputSymbolsArr[index] === ".")) {
                this.xadvanceCurrent = this.$store.state.currentSmallXadvance === null ? this.$store.getters.xadvanceSmall: this.$store.state.currentSmallXadvance
                this.$store.commit("setJSONHasSmallSymbols", true)
              yoffset = this.$store.state.currentSmallYadvance
                if(this.$store.state.currentSmallXadvance) {
                  //case when general xadvance is changed
                  this.xOffsetCurrent = (this.$store.state.currentSmallXadvance - symbolWidth)/2
                } else {
                  //case when general xadvance not touched(default)
                  this.xOffsetCurrent = (this.$store.getters.xadvanceSmall- symbolWidth) /2
                }

                }

              //define xadvance for plain symbols
            else {
              this.xadvanceCurrent = this.$store.state.currentXadvance === null ? this.$store.getters.xadvance : this.$store.state.currentXadvance
                  if(this.$store.state.currentXadvance) {
                    //case when general xadvance is changed
                    this.xOffsetCurrent = (this.$store.state.currentXadvance - symbolWidth)/2
                  } else {
                    //case when general xadvance not touched(default)
                    this.xOffsetCurrent = (this.$store.getters.xadvance- symbolWidth)/2
                  }
              }

       // this.xOffsetCurrent = (Number(this.xadvanceCurrent)- symbolWidth) /2
        //this.yOffsetCurrent = (Number(this.yadvanceCurrent)- symbolHeight) /2
        if(this.$store.state.inputSymbolsArr[index] === this.$store.state.symbolForCorrectingXOffset){
            this.xoffsetForSymbolCorrectingXAdvance = this.xOffset
        } 
            
            let row = `    <char id="${this.charCodeArr[index]}" x="${x}" y="${y}" width="${symbolWidth}" height="${symbolHeight}" xoffset="${0}" yoffset="${yoffset}" xadvance="${this.xadvanceCurrent}" /><!-- ${this.$store.state.inputSymbolsArr[index]} -->\n`
              this.XMLText += row

               let symbolsParams = {
                  index,
                  charId:this.charCodeArr[index],
                  symbol:this.$store.state.inputSymbolsArr[index],
                  xoffset:this.xOffsetCurrent*2,
                  yoffset:yoffset,
                  xadvance: Number(this.xadvanceCurrent),
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

      let spaceSymbolsParams = {
        symbol: " ",
        index: 27,
        charId:"32",
        xoffset:0,
        yoffset:0,
        xadvance: Number(this.xadvanceForTabSymbol),
        width:Number(this.xadvanceForTabSymbol),
        height:0,
        x:0,
        y:0
      }
      let tabSymbolsParams = {
        symbol: "   ",
        index: 28,
        charId:"9",
        xoffset:0,
        yoffset:0,
        xadvance: Number(this.xadvanceForSpaceSymbol),
        width:Number(this.xadvanceForSpaceSymbol),
        height:0,
        x:0,
        y:0
      }

      this.arrSymbolsParams.push(spaceSymbolsParams)
      this.arrSymbolsParams.push(tabSymbolsParams)




      this.$store.commit("setArrSymbolsParams", this.arrSymbolsParams);
      this.$store.commit("setXMLText", this.XMLText);


    } 
  },
  mounted() {
     this.prepareDataForXML()
  }
}

</script>
<style>

.XML {
  overflow: hidden;
  //height: 60vh;
}
</style>
