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
      // canvasWidths: 1200,
      // canvasHeight: 300,
      spritesheetWrapper: null,
      arrForPreview:[]

    };
  },
  watch: {
    '$store.state.arrSymbolsParams': function () {

    },
    '$store.state.currentXadvance': function () {
      this.render()
    },
    '$store.state.currentSmallXadvance': function () {
      this.render()
    },
    '$store.state.currentSmallYadvance': function () {
      this.render()
    },
    '$store.state.currentMultiplierYoffset': function () {
      this.render()
    },
    '$store.state.showBorders': function () {
      this.render()
    },
    '$store.state.showInitBorders': function () {
      this.render()
    },
    '$store.state.arrSymbolsForPreview': function () {
          this.render(this.$store.getters.isDigits)
        },

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
          this.render()
        });
      })
    },

    render() {
      this.clearStage();
      this.addCanvasBorder();
      this.arrForPreview = this.$store.state.arrSymbolsForPreview
      let currentX = 100;
      let initialX = 100;
      let previousSymbolParams = null;
      this.arrForPreview.forEach((symbol, i, arr) => {

          let currentSymbolParams = this.$store.getters.getSymbolById(symbol)
          let xoffset = (currentSymbolParams.width - currentSymbolParams.xadvance) / 2
          currentX = currentX - xoffset


          if (i !== 0) {
              initialX = initialX + currentSymbolParams.width
              previousSymbolParams = this.$store.getters.getSymbolById(arr[i-1]);
              let previousSymbolXoffset = (previousSymbolParams.width - previousSymbolParams.xadvance)/2
              let currentSymbolXoffset = (currentSymbolParams.width - currentSymbolParams.xadvance)/2
              let previousX = currentX
              currentX = previousX + previousSymbolXoffset + previousSymbolParams.xadvance;

            }
          let bordersShowing = this.$store.state.showBorders
          let bordersInitShowing = this.$store.state.showInitBorders
          this.addSymbol(currentX, currentSymbolParams.yoffset, currentSymbolParams,xoffset, bordersShowing, bordersInitShowing )
      })
    },

    addSymbol(x, y, currentSymbol, xoffset, isBorder, isInitBorder) {
      let texture = this.$store.state.textures[currentSymbol.index]
      let symbolSprite = PIXI.Sprite.from(texture);
      symbolSprite.x = x
      symbolSprite.y = y
      //add initial border
      let spriteSheetBorderInitial = new PIXI.Graphics();
      spriteSheetBorderInitial.lineStyle(2, 0x000000, 1);
      spriteSheetBorderInitial.drawRect(x, 0, currentSymbol.width, currentSymbol.height);
      spriteSheetBorderInitial.endFill();

      //add current border
      let spriteSheetBorder = new PIXI.Graphics();
      spriteSheetBorder.lineStyle(4, 0xFF0000, 1);
      spriteSheetBorder.drawRect(x + xoffset, 0, currentSymbol.xadvance, currentSymbol.height);
      spriteSheetBorder.endFill();
      if (isBorder) {
        this.spritesheetWrapper.addChild(spriteSheetBorder)
      }
      if (isInitBorder) {
        this.spritesheetWrapper.addChild(spriteSheetBorderInitial)
      }
      this.spritesheetWrapper.addChild(symbolSprite)

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
      if (this.app && this.app.stage.children.length > 0) {
        while (this.app.stage.children[0]) {
          this.app.stage.removeChild(this.app.stage.children[0])
        }
      }
    },
  }
};
</script>
