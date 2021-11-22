<template>
 <div>
    <div v-if="showOpenFile">
      <label class="m-3">
        <b>Please, choose your files</b>
        <input type="file" class="btn btn-secondary btn-lg m-3" multiple accept="application/JSON,image/*" @change="loadResources" >
      </label>
    </div>
    <div v-if="showImage">
      <h1>Image preview</h1>
      <div  class="card" style="width: 15rem">
        <img ref="img" src="" class="card-img-top" alt="image preview">
      </div>
    </div>
    <div v-if="showError" class="alert alert-danger" role="alert">
      You must choose 2 files: JSON and PNG!
    </div>
  </div>

</template>

<script>
export default {
  data: ()=>{
    return {
      showImage:false,
      showOpenFile:true,
      showError:false,
      ImgUrl:null
    }
  },
  methods: {
    loadResources(ev) {
      let jsonfile,imageFile
      const fileListAsArray = Array.from(ev.target.files)

      if(fileListAsArray.length!==2) {
        this.showError = true
      }

      else{
        this.showError = false
        let JsonPromise,ImagePromise
        fileListAsArray.forEach(file => {
            if(file.type === "application/json") {
              jsonfile=file
               JsonPromise =  new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.onload = event => resolve(event.target.result)
                fileReader.onerror = error => reject(error)
                fileReader.readAsText(jsonfile)
              })
            }
            if(file.type ==="image/png") {
              imageFile=file
              this.ImgUrl = URL.createObjectURL(file);
              this.$emit("getImgUrl",this.ImgUrl)

               ImagePromise =  new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.onload = event => {

                  resolve(event.target.result)
                }
                fileReader.onerror = error => reject(error)
                fileReader.readAsDataURL(imageFile);
              })
            }
      })

        let resourceReady = Promise.all([JsonPromise, ImagePromise]).then(([json,image]) => {
          this.$store.commit('setJSON', json);
          this.$store.commit('setPNG', image);

        });
      }




    }
  }
};
</script>

<style>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;

  /* Fancy button looking */
  border: 2px solid black;
  border-radius: 5px;
  padding: 12px 18px;
  cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>