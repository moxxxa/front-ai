<template>
  <q-page>
    <div class="main-page">
    <br>
    <center>
      <q-uploader
        ref="fileUploader"
        :url="providedURL"
        label="Pick an animal image to start the prediction"
        accept=".jpg, .png, .jpeg"
        style="max-width: 500px;max-height:300px"
        @added="onImageAdded"
        @removed="onImageRemoved"
        @uploaded="imageUploaded"
      />
    </center>
    <br>
    <center>
      <div>
        <h5>
          {{imageStatut}}
          <span v-if="statut === 'The image has been successfully uploaded'">
            <q-icon name="done" size="lg" color="green"/>
          </span>
        </h5>
      </div>
    </center>
    <div>
      <center v-if="timeToPredict">
        <q-card style="width: 600px; height: 70px;">
         <img :src="currentImage" class="img-toPredict">
         <q-item>
           <q-item-section>
             <font size="4" color="green" v-if="showLoading">Some important process is in progress. Hang on...</font>
             <center v-if="showLoading"><q-spinner-audio color="secondary" size="xl"/></center>
           </q-item-section>
         </q-item>
         <br><br><br>
       </q-card>
     </center>
       <div v-else>
         <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
       </div>
    </div>
    <div id="prediction">
      &nbsp;
    </div>
    <q-dialog v-model="showResultDialog">
      <q-card>
        <q-card-section>
          <div class="text-h4">
            prediction result : {{predictionResult}}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  </q-page>
</template>

<script>
import api from '../api/api'
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll

export default {
  name: 'PageIndex',
  data() {
    return {
      statut: "To start, please upload a photo",
      timeToPredict: false,
      images: [
        'statics/chien.jpg',
        'statics/chat.jpg',
        'statics/bird.jpg',
        'statics/unkown.jpg'
      ],
      currentIndexOfAnimation: 0,
      showResultDialog: false,
      showLoading: false,
      result: -1
    }
  },
  methods: {
    initializePrediction() {
      this.currentIndexOfAnimation = 0;
      this.result = -1;
    },
    onImageAdded() {
      this.initializePrediction();
      this.statut = "The image has been succesffuly added";
    },
    onImageRemoved() {
      this.initializePrediction();
      this.statut = "To start, please upload a photo";
      this.$refs.fileUploader.reset();
      this.timeToPredict = false;
    },
    imageUploaded(info) {
      this.result = (info && info.xhr && info.xhr.response) ? info.xhr.response : -1;
      this.statut = 'The image has been successfully uploaded';
      let vm = this;
      api.loading('Chargement en cours');
      setTimeout(function () {
        vm.timeToPredict = true;
        vm.showLoading = true;
        vm.goToPrediction();
        api.finishedLoading();
      }, 3000);
    },
    goToPrediction() {
      const ele = document.getElementById('prediction')
      const target = getScrollTarget(ele);
      const offset = ele.offsetTop - ele.scrollHeight;
      const duration = 500;
      setScrollPosition(target, offset, duration);
      let vm = this;
      setTimeout(function () {
        vm.launchAnimation(0);
      }, 1000);
    },
    launchAnimation(i) {
      let vm = this;
      if (i < 20) {
        setTimeout(function () {
          vm.currentIndexOfAnimation ++;
          vm.launchAnimation(i+1);
        }, 200);
      } else {
        this.currentIndexOfAnimation = this.result;
        this.showLoading = false;
        setTimeout(function () {
          vm.showResultDialog = true;
        }, 500);
      }
    }
  },
  computed: {
    currentImage() {
      if (this.currentIndexOfAnimation > 3) {
        this.currentIndexOfAnimation = 0;
      }
      return this.images[this.currentIndexOfAnimation];
    },
    imageStatut() {
      return this.statut;
    },
    predictionResult() {
      switch (this.result) {
        case '0':
          return 'Dog'
          break;
        case '1':
          return 'Cat'
          break
        case '2':
          return 'parrot'
        default: return 'Unknown'

      }
      return this.result;
    },
    providedURL() {
    	return "http://127.0.0.1:5000/upload";
    }
  },
  mounted() {

  },
  created() {

  }
}
</script>
<style>
.main-page {
  background-color: #D8D8D8;
}
.img-toPredict {
  width: 400px;
  height: 350px;
}
</style>
