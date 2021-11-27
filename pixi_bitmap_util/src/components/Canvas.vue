<template>
  <div ></div>
</template>

<script>
import * as PIXI from "pixi.js";

export default {
  name: "Canvas",
  data() {
    return {
      app: null,
      canvasWidths:300,
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
    xoffsetFinal(){
      if(this.$store.state.currentXadvance) {
        return this.$store.state.currentXadvance
      } else {
        return this.$store.getters.xadvance
      }
    },
    xoffsetSmallFinal(){
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
    firstSymbolForRender() {

      let params = {
        symbol:"", width:0, x:0, y:0, index:0
      };
      this.$store.state.textures.forEach((texture, index)=> {
        if((texture.frame.x === this.$store.state.symbolParamsForCorrectingXOffset.x) && ( texture.frame.y === this.$store.state.symbolParamsForCorrectingXOffset.y)) {
          params.symbol = this.$store.state.symbolParamsForCorrectingXOffset.symbol
          params.index = index
          params.x = texture.frame.x
          params.y = texture.frame.y
          params.width = texture.orig.width
        }
      })
      return params
    },

  },
  mounted() {
    this.app = new PIXI.Application({
      width: 400,
      height: 300,
      transparent: false,
      antialias: true,
    });
    this.$el.appendChild(this.app.view);
    this.app.renderer.view.style.display = "block";
    this.app.renderer.autoResize = true;
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
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
      
      this.addSymbol(0, 0, this.firstSymbolForRender.index, false)
      if(useCommaSymbol) {
        this.addSymbol(this.firstSymbolForRender.width + this.comaSymbol.xoffset, 0, this.comaSymbol.index, false)
      }else{
        this.addSymbol(this.firstSymbolForRender.width + this.$store.getters.secondSymbolXoffsetForCanvas.xoffset , 0, this.firstSymbolForRender.index, false)
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
      if(this.showBorder){
        spriteContainer.addChild(spriteSheetBorder)
      }
      this.spritesheetWrapper.addChild(spriteContainer)
    },

    addCanvasBorder() {
      this.spritesheetWrapper = new PIXI.Container()
      this.spriteSheetBorder = new PIXI.Graphics();
      this.spriteSheetBorder.lineStyle(2, 0x000000, 1);
      this.spriteSheetBorder.drawRect(0, 0, this.canvasWidths, this.canvasHeight);
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
