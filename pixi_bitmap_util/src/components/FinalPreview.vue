<template>
  <div></div>
</template>

<script>
import * as PIXI from "pixi.js";
export default {
  name: "FinalPreview",
  data() {
    return {
      app: null,
      canvasWidths:300,
      canvasHeight:300,
      spritesheetWrapper:null,

    };
  },
  watch: {

  },
  computed: {
      isDigits(){
          return this.$store.state.jsonHasSmallSymbols
      }

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
   // this.app.renderer.autoResize = true;
    //this.app.renderer.resize(window.innerWidth, window.innerHeight);
    
  },
  methods: {
    
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
