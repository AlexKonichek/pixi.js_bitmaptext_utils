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
          this.render()
        });
      })
    },

    render() {
      this.clearStage();
      this.addCanvasBorder();
      this.arrForPreview = this.$store.state.arrSymbolsForPreview
      let currentX = 0;
      let previousSymbolParams = null;
      this.arrForPreview.forEach((symbol, i, arr) => {
          let currentSymbolParams = this.$store.getters.getSymbolById(symbol)
          if (i !== 0) {
            previousSymbolParams = this.$store.getters.getSymbolById(arr[i-1]);
            currentX = currentX + Number(previousSymbolParams.xadvance);
          }

          this.addSymbol(currentX, currentSymbolParams.yoffset, currentSymbolParams, false)
      })
    },

    addSymbol(x, y, currentSymbol, isBorder) {
      let texture = this.$store.state.textures[currentSymbol.index]
      let spriteContainer = new PIXI.Container()
      let symbolSprite = PIXI.Sprite.from(texture);
      spriteContainer.x = x
      spriteContainer.y = y

      let spriteSheetBorder = new PIXI.Graphics();
      spriteSheetBorder.lineStyle(3, 0x000000, 1);
      spriteSheetBorder.drawRect(0, 0, currentSymbol.xadvance, currentSymbol.height);
      spriteSheetBorder.endFill();
      spriteContainer.addChild(symbolSprite)
      if (isBorder) spriteContainer.addChild(spriteSheetBorder)

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
      //this.spritesheetWrapper.addChild(this.spriteSheetBorder)
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
