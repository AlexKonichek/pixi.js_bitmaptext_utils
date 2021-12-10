<template>
<div>
    <div id="RequiredSymbols">
        <label class="text-white h4 mt-2" for="symbols">Required symbols</label>
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
    <div id="warning">
        <div v-if="this.$store.state.showInputError" class="alert alert-danger" role="alert">
                    <p> <b>Not enough symbols for parsing!</b></p>
                    <p>Should be {{this.$store.getters.framesArrLength}}</p>
        </div>
    </div>
    <div id="ChooseSymbolsSet">
        <div>
             <label  class="label text-white h4" for="Select">Choose symbols set</label>
             <select class="form-control form-control-lg mb-2" id="Select" v-model="inputSymbols" v-on:change="chooseSymbolsHandler" >
               <option  :value="this.selectOption1">{{ this.selectOption1 }}</option>
               <option>{{ this.selectOption2 }}</option>
             </select>
           </div>
    </div>
    <div id="FontFamily">
       <!-- <label class="text-white h4" for="font-family">Font family</label>-->
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
    </div>
    <div id="generalXadvance">
        <label class="text-white h4" for="XAdvance">xadvance for plain symbols</label>
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

    </div>
    <div id="smallXadvance">
        <div v-if="this.$store.state.jsonHasSmallSymbols">
              <label class="text-white h4" for="XAdvanceSmall">xadvance for "." ","</label>
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

    </div>
    <button v-if="this.$store.state.showCreateXMLButton" class="btn btn-success m-4"  v-on:click="showXMLComponent">Create XML</button>
    <div id="CanvasButton" v-if="this.$store.state.isDataReadyForXMLCreator">
        <button class="btn btn-success m-3"  v-on:click="showCanvas">Show Demo</button>
    </div>
    <div id="clearButton">
        <button ref='refresh' class="btn btn-light m-3"  v-on:click="refreshPage">Clear</button>
    </div>
              
           
</div>
  
</template>

<script>

export default {
  name: 'SidePanel',
  data: () => {
      return {
          inputSymbols:'',
          selectOption1: ',.×0123456789',
          selectOption2: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      }
  },
  watch: {
      inputSymbols: function () {
        this.symbolsArr = []
        let symbolsArr = this.inputSymbols.split("");
        this.$store.commit("setSymbolsArr", symbolsArr)
        console.warn("inputSymbols is changed", this.symbolsArr)
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

    maxSmallSymbolWidthModel: {
      set(value) {
        this.$store.commit('updateCurrentSmallXadvance', value)
      },
      get() {
        return this.$store.state.currentSmallXadvance !== null ? this.$store.state.currentSmallXadvance : this.initialXadvanceSmall
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
         this.$store.commit('isTrimmed', trimmed);
      },
      validateSymbolsForm() {
          let symbolsArr = this.$store.state.inputSymbolsArr
          let framesArrLength = this.$store.getters.framesArrLength
          if(framesArrLength === symbolsArr.length) {
              this.$store.commit("setShowInputError",false);
              this.parseJSON()
          } else {
            this.$store.commit("setShowInputError", true);
            this.$store.commit("setShowCreateXMLButton", false)
          }
    },
    parseJSON() {
      console.warn("parseJSON");
      let arrSmallSymbolsWidth = [];
      let arrSymbolsWidths = [];
      let arrSymbolsHeights = [];
      let arrSmallSymbolsHeights = [];
      let inputSymbolsArr = this.$store.state.inputSymbolsArr
      let symbolParamsForCorrectingXOffset = { symbol:"S", width:0, x:0, y:0 }

      if(!inputSymbolsArr.includes(this.$store.state.symbolForCorrectingXOffset)) {
        this.$store.commit("setSymbolForCorrectingXOffset",  "0")
        }
      
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
            if(inputSymbolsArr[index] === this.$store.state.symbolForCorrectingXOffset) {
               symbolParamsForCorrectingXOffset.width = frame.frame.w
               symbolParamsForCorrectingXOffset.x = frame.frame.x
               symbolParamsForCorrectingXOffset.y = frame.frame.y
               this.$store.commit("setSymbolParamsForCorrectingXOffset", symbolParamsForCorrectingXOffset)
            }
            
      })
      
      this.$store.commit("setArrSymbolsHeights",arrSymbolsHeights);
      this.$store.commit("setArrSymbolsWidths",arrSymbolsWidths);
      this.$store.commit("setArrSmallSymbolsWidth",arrSmallSymbolsWidth);
      this.$store.commit("setArrSmallSymbolsHeights",arrSmallSymbolsHeights);


      this.$store.commit("setShowCreateXMLButton", true )
    },
    showXMLComponent() {
         this.$store.commit("setDataReadyForXMLCreator", true)
         this.$store.commit("setShowCreateXMLButton", false)
         this.$store.commit("setShowFrameNamesOrderMessage", false)
    },
    chooseSymbolsHandler(e) {
      console.log(e)
    },
    showCanvas() {
        this.$store.commit("setShowCanvas", true )

    },
    refreshPage(){location.reload()}
  }
  
}
</script>

<style>
</style>
