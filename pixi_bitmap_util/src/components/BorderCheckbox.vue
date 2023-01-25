<template>
  <div class="checkbox" v-if="this.$store.state.showCanvas">
    <div class="form-check">
      <input type="checkbox" class="form-check-input" id="ShowBorders" v-model="showBorders" />
      <label class="xadvanceBorders form-check-label" :class="{red:showBorders}" for="ShowBorders">Show xadvance borders</label>

    </div>
    <div class="form-check">
      <input type="checkbox" class="form-check-input" id="showInitBorders" v-model="showInitBorders" />
      <label class="form-check-label xadvanceBorders" :class="{black:showInitBorders}"  for="showInitBorders">Show width borders</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "BorderCheckbox",
  computed: {
    showBorders: {
      get() {
        return this.$store.state.showBorders
      },
      set(value) {
        this.$store.commit('setShowBorders', value)
      }
    },
    showInitBorders:{
      get() {
        return this.$store.state.showInitBorders
      },
      set(value) {
        this.$store.commit('setShowInitBorders', value)
      }
    },
  }
}
</script>

<style scoped>
.checkbox {
  margin: 2vh;
}
</style>
