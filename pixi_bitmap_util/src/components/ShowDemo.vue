<template>
  <div></div>
</template>

<script>
import * as PIXI from "pixi.js";

export default {
  name: "ShowDemo",
  data() {
    return {
      app: null,
      canvasWidths:500,
      canvasHeight:300,
      spritesheetWrapper:null,

    };
  },
  watch: {
    '$store.state.currentXadvance': function() {
      console.warn("render",this.$store.state.currentXadvance)
      this.render(false)
    },
    '$store.state.currentSmallXadvance': function() {
      console.warn("render",this.$store.state.currentSmallXadvance)
      this.render(true)
    }
  },
  computed: {
    XadvanceFinal(){
      if(this.$store.state.currentXadvance) {
        return this.$store.state.currentXadvance
      } else {
        return this.$store.getters.xadvance
      }
    },
    XadvanceSmallFinal(){
      if(this.$store.state.currentSmallXadvance) {
        return this.$store.state.currentSmallXadvance
      } else {
        return this.$store.getters.xadvanceSmall
      }
    },
    itemWidth() {
      return this.symbolWidth
    },
    comaSymbol() {
      return this.$store.getters.comaParams
    },
    secondSymbolForRender() {
     return this.$store.getters.secondSymbolXoffsetForCanvas
    },
    secondSmallSymbolForRender() {
      return this.$store.getters.secondSmallSymbolXoffsetForCanvas
    },
    /*firstLetterForRender() {
      let params = {
        symbol:"", width:0, x:0, y:0, index:0
      };
      this.$store.state.textures.forEach((texture, index)=> {
        if((texture.frame.x === this.$store.state.firstLetterParamsForCorrectingXOffset.x) && ( texture.frame.y === this.$store.state.firstLetterParamsForCorrectingXOffset.y)) {
          params.symbol = this.$store.state.firstLetterParamsForCorrectingXOffset.symbol
          params.index = index
          params.x = texture.frame.x
          params.y = texture.frame.y
          params.width = texture.orig.width
        }
      })
      return params
    },*/

  },
  mounted() {
    this.app = new PIXI.Application({
      width: this.$store.getters.canvasWidths,
      height: this.$store.getters.canvasHeight,
      transparent: true,
      antialias: true,
      backgroundColor: 0xffffff
    });
    this.$el.appendChild(this.app.view);
    this.app.renderer.view.style.display = "block";
   // this.app.renderer.autoResize = true;
    //this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.parse()
  },
  methods: {
    parse() {
      console.warn("parse")
      let atlas = JSON.parse(this.$store.state.loadedJSON)
      let loader = this.app.loader;
      let png = this.$store.state.loadedPNG
      let textures = []
      loader.add(png).load(() => {
        const sheet = new PIXI.Spritesheet(
            loader.resources[png].texture.baseTexture, atlas
        );
        sheet.parse((...args) => {
          
          textures = Object.values(args[0])
          this.$store.commit("setTextures", textures)
          this.render(false)
        });
      })
    },

    render(useCommaSymbol) {
      console.warn("render")
      //this.showRenderButton = false
      this.clearStage();
      this.addCanvasBorder();
     // this.secondLetterForRender = this.firstLetterForRender
      let firstSymbol, secondSymbol, thirdSymbol
      if(this.$store.getters.isDigits) {
        firstSymbol = this.$store.getters.firstDigitForCanvas
        secondSymbol = this.$store.getters.secondDigitForCanvas
        thirdSymbol = this.$store.getters.thirdDigitForCanvas
      } else {
        firstSymbol = this.$store.getters.firstLetterForCanvas
        secondSymbol = this.$store.getters.secondLetterForCanvas
        thirdSymbol = this.$store.getters.thirdLetterForCanvas
      }

      this.addSymbol(0, 0, firstSymbol.index, true)
      if(useCommaSymbol) {
        //this.addSymbol(this.firstLetterForRender.width + this.comaSymbol.xoffset, 0, this.comaSymbol.index, false)
      }else{
        let xStartForThirdLetter = firstSymbol.width + secondSymbol.xoffset + secondSymbol.width
        this.addSymbol(firstSymbol.width + secondSymbol.xoffset , 0, secondSymbol.index, true)
        this.addSymbol( xStartForThirdLetter + thirdSymbol.xoffset, 0, thirdSymbol.index, true )
      }
    },

     addSymbol(x, y, index, border) {
      let texture = this.$store.state.textures[index]
      let spriteContainer = new PIXI.Container()
      let symbolSprite = PIXI.Sprite.from(texture);
      spriteContainer.x = x
      spriteContainer.y = y
      let spriteSheetBorder = new PIXI.Graphics();
      spriteSheetBorder.lineStyle(3, 0x000000, 1);
      spriteSheetBorder.drawRect(0, 0, texture.orig.width, texture.orig.height);
      spriteSheetBorder.endFill();
      spriteContainer.addChild(symbolSprite)
      if(border){
        spriteContainer.addChild(spriteSheetBorder)
      }
      this.spritesheetWrapper.addChild(spriteContainer)
    },

    addCanvasBorder() {
      this.spritesheetWrapper = new PIXI.Container()
      this.spriteSheetBorder = new PIXI.Graphics();
      this.spriteSheetBorder.lineStyle(2, 0x000000, 1);
      this.spriteSheetBorder.drawRect(0, 0, this.$store.getters.canvasWidths, this.$store.getters.canvasHeight);
      this.spriteSheetBorder.endFill();
      this.spriteSheetBorder.x = 0;
      this.spriteSheetBorder.y = 0;
      this.spritesheetWrapper.addChild(this.spriteSheetBorder)
      this.app.stage.addChild(this.spritesheetWrapper);
    },
    clearStage() {
      console.log("clearStage")
      if(this.app && this.app.stage.children.length>0){
        while(this.app.stage.children[0]) {
          this.app.stage.removeChild(this.app.stage.children[0])
        }
      }
    },
  }
};
</script>
