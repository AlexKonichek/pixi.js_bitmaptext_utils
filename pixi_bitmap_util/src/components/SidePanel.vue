<template>
  <div class="slidePanel">
    <div>
      <div id="RequiredSymbols">
        <label
            class="text-white"
            style="font-size: 12pt"
            for="symbols">Required symbols
        </label>
        <div class="input-group">
          <input
              type="text"
              id="symbols"
              class="form-control mr-3"
              v-model="inputSymbols"
              required
              placeholder="paste your symbols"
              style="font-size: 12pt"
          >
        </div>
      </div>
      <div id="warning">
        <div v-if="this.$store.state.showInputError" class="alert alert-danger" role="alert">
          <p><b>Not enough symbols for parsing!</b></p>
          <p>Should be {{ this.$store.getters.framesArrLength }}</p>
        </div>
      </div>
      <div id="ChooseSymbolsSet" v-if="showRequiredSymbolsInput">
        <div>
          <label class="label text-white"
                 for="Select"
                 style="font-size: 12pt"
          >
            Choose symbols set
          </label>
          <select class="form-control"
                  id="Select"
                  style="font-size: 12pt"
                  v-model="inputSymbols"
                  v-on:change="chooseSymbolsHandler"
          >
            <option :value="this.selectOption1">{{ this.selectOption1 }}</option>
            <option>{{ this.selectOption2 }}</option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="showOffsetsInputs">
      <div id="generalXadvance">
        <label class="text-white" style="font-size: 12pt" for="XAdvance">xadvance for plain symbols</label>
        <div class="input-group mb-1">
          <input
              id="XAdvance"
              class="form-control mr-3"
              ref="XAdvance"
              v-model="maxSymbolWidthModel"
              step="1"
              type="number"
              style="font-size: 12pt"
              :disabled="this.$store.state.isTrimmed"
          >
        </div>

      </div>
      <div v-if="this.$store.getters.hasDotSymbol">
        <label class="text-white" style="font-size: 12pt" for="XAdvanceSmall">xadvance for "." ","</label>
        <div class="input-group mb-1">
          <input
              id="XAdvanceSmall"
              class="form-control mr-3"
              ref="XAdvance"
              v-model="maxSmallSymbolWidthModel"
              step="1"
              type="number"
              style="font-size: 12pt"
              :disabled="this.$store.state.isTrimmed"
          >
        </div>
      </div>
      <div v-if="this.$store.getters.hasDotSymbol">
        <div>
          <label class="text-white" style="font-size: 12pt" for="YAdvanceSmall">y offsets for "." ","</label>
          <div class="input-group mb-1">
            <input
                id="YAdvanceSmall"
                class="form-control mr-3"
                ref="XAdvance"
                v-model="maxSmallSymbolHeightModel"
                step="1"
                type="number"
                style="font-size: 12pt"
            >
          </div>
        </div>
      </div>
      <div v-if="this.$store.getters.hasMultiplierSymbol">
        <div>
          <label class="text-white" style="font-size: 12pt" for="multiplier">y offsets for "×"</label>
          <div class="input-group mb-1">
            <input
                id="multiplier"
                class="form-control mr-3"
                v-model="maxMultiplierSymbolHeightModel"
                step="1"
                type="number"
                style="font-size: 12pt"
            >
          </div>
        </div>

      </div>
    </div>
    <div v-if="this.$store.state.isDataReadyForXMLCreator" id="symbols_preview">
      <label class="text-white" style="font-size: 12pt" for="symbols">symbols for preview</label>
      <div class="input-group">
        <input v-on:input="chooseSymbolsSetForPreview"
            type="text"
            id="preview"
            class="form-control mr-3"
            required
            placeholder="tap symbols for preview"
               style="font-size: 12pt"
        >
      </div>
      <div v-if="this.$store.state.showErrorInputPreview" class="alert alert-danger" role="alert">
          <p><b>You can input only those symbols which are in required symbols form!</b></p>
        </div>
    </div>
    <BorderCheckbox v-show="!this.$store.state.isTrimmed"></BorderCheckbox>

    <button v-if="this.$store.state.showCreateXMLButton" class="btn btn-success m-4" v-on:click="showXMLComponent">
      Create XML
    </button>


  </div>

</template>

<script>

import BorderCheckbox from "@/components/BorderCheckbox";

export default {
  name: 'SidePanel',
  components: {BorderCheckbox},
  data: () => {
    return {
      inputSymbols: '',
      selectOption1: ',.×0123456789',
      selectOption2: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      showOffsetsInputs:false,
      showRequiredSymbolsInput:true,
      showPreviewSymbolsForm: false,
      showBtn: false,
      showWarning:false,

    }
  },
  watch: {
    inputSymbols: function () {
      this.symbolsArr = []
      let symbolsArr = this.inputSymbols.split("");
      this.$store.commit("setSymbolsArr", symbolsArr)
      this.initialParse()
      this.validateSymbolsForm()
    },
  },
  computed: {
    initialXadvance() {
      return this.$store.getters.xadvance
    },
    maxSymbolWidthModel: {
      set(value) {
        this.$store.commit('updateCurrentXadvance', value)
      },
      get() {
        return this.$store.state.currentXadvance !== null ? this.$store.state.currentXadvance : this.initialXadvance
      }
    },

    initialXadvanceSmall() {
      return this.$store.getters.xadvanceSmall
    },

    initialYadvanceSmall() {
      return this.$store.getters.yadvanceSmall
    },
    initialYoffset() {
      return this.$store.getters.initialYoffset
    },

    maxSmallSymbolWidthModel: {
      set(value) {
        this.$store.commit('updateCurrentSmallXadvance', value)
      },
      get() {
        return this.$store.state.currentSmallXadvance !== null ? this.$store.state.currentSmallXadvance : this.initialXadvanceSmall
      }
    },
    maxSmallSymbolHeightModel: {
      set(value) {
        this.$store.commit('updateCurrentSmallYadvance', value)
      },
      get() {
        return this.$store.state.currentSmallYadvance !== null ? this.$store.state.currentSmallYadvance : this.initialYadvanceSmall
      }
    },
    maxMultiplierSymbolHeightModel: {
      set(value) {
        this.$store.commit('updateCurrentMultiplierYoffset', value)
      },
      get() {
        return this.$store.state.currentMultiplierYoffset !== null ? this.$store.state.currentMultiplierYoffset : this.initialYoffset
      }
    },
  },
  methods: {
    initialParse() {
      let data = this.$store.state.jsonData
      let frames = Object.values(data)[0]
      let framesArr = Object.values(frames)
      this.$store.commit('setFrames', framesArr);
      let trimmed = framesArr[0].trimmed
     // this.$store.commit('isTrimmed', trimmed);
    },
    validateSymbolsForm() {
      let symbolsArr = this.$store.state.inputSymbolsArr
      let framesArrLength = this.$store.getters.framesArrLength
      if (framesArrLength === symbolsArr.length) {
        this.$store.commit("setShowInputError", false);
        this.parseJSON()
      } else {
        this.$store.commit("setShowInputError", true);
        this.$store.commit("setShowCreateXMLButton", false)
      }
    },
    parseJSON() {
      let arrSmallSymbolsWidth = [];
      let arrSymbolsWidths = [];
      let arrSymbolsHeights = [];
      let arrSmallSymbolsHeights = [];
      let inputSymbolsArr = this.$store.state.inputSymbolsArr
      let symbolParamsForCorrectingXOffset = {symbol: "S", width: 0, x: 0, y: 0}

      if (!inputSymbolsArr.includes(this.$store.state.symbolForCorrectingXOffset)) {
        this.$store.commit("setSymbolForCorrectingXOffset", "0")
      }

      this.$store.state.framesArr.forEach((frame, index) => {
        arrSymbolsWidths.push(frame.frame.w);
        arrSymbolsHeights.push(frame.frame.h);
        if (inputSymbolsArr[index] === ",") {
          arrSmallSymbolsWidth.push(frame.frame.w)
          arrSmallSymbolsHeights.push(frame.frame.h)
          this.jsonHasSmallSymbols = true
        }
        if (inputSymbolsArr[index] === ".") {
          arrSmallSymbolsWidth.push(frame.frame.w)
          arrSmallSymbolsHeights.push(frame.frame.h)
          this.jsonHasSmallSymbols = true
          this.dotIndex = index
        }
        if (inputSymbolsArr[index] === this.$store.state.symbolForCorrectingXOffset) {
          symbolParamsForCorrectingXOffset.width = frame.frame.w
          symbolParamsForCorrectingXOffset.x = frame.frame.x
          symbolParamsForCorrectingXOffset.y = frame.frame.y
          this.$store.commit("setSymbolParamsForCorrectingXOffset", symbolParamsForCorrectingXOffset)
        }

      })

      this.$store.commit("setArrSymbolsHeights", arrSymbolsHeights);
      this.$store.commit("setArrSymbolsWidths", arrSymbolsWidths);
      this.$store.commit("setArrSmallSymbolsWidth", arrSmallSymbolsWidth);
      this.$store.commit("setArrSmallSymbolsHeights", arrSmallSymbolsHeights);


      this.$store.commit("setShowCreateXMLButton", true)
    },
    showXMLComponent() {
      this.showOffsetsInputs = true
      this.showRequiredSymbolsInput = false
      this.$store.commit("setDataReadyForXMLCreator", true)
      this.$store.commit("setShowCreateXMLButton", false)
      this.$store.commit("setShowFrameNamesOrderMessage", false)
    },
    chooseSymbolsHandler(e) {
      console.log(e)
    },
    showCanvas() {
      this.$store.commit(("setShowCanvas"),true);
      this.showBtn = false
      //this.chooseSymbolsSetForPreview()
    },
    chooseSymbolsSetForPreview(e) {
      this.showWarning = false;
      //this.showBtn = false
      if(e.target.value !== "") {
          let symbols = [...e.target.value]
          symbols.forEach(symbol => {
            const inputElement = (obj) => obj.symbol === symbol;
            if (this.$store.state.arrSymbolsParams.find(inputElement) == -1) {
                this.showWarning = true
                this.$store.commit(("setShowCanvas"),false);
            }
            else {
                this.$store.commit("setSymbolsForPreview", [...e.target.value])
                this.$store.commit(("setShowCanvas"),true);
            }
          })
      }
      else {
        this.$store.commit("setSymbolsForPreview", [...e.target.value])
      }



      //this.$store.commit("setShowCanvas", true)

    },
    refreshPage() {
      location.reload()
    }
  }

}
</script>

<style>
.slidePanel {
  overflow: hidden;
}
.xadvanceBorders {
  text-align: left;
  font-size: 2vh;
  font-weight: bold;
  color: aliceblue;
}
.red{
  color: red;
}
.black{color: black}

input { font-size: 12px; }

</style>
