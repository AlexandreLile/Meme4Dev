<template>
  <div class="container">
    <div class="img_container">
      <div v-if="showFileInput">
        <input
          type="file"
          @change="handleFileChange"
          accept="image/*"
        ></input>
      </div>
      <div v-if="selectedImageUrl" class="image-preview-container">
        <img
          :src="selectedImageUrl"
          alt="Image Preview"
          class="image-preview"
        />
        <div class="text-overlay" :style="topTextStyle">{{ topText }}</div>
        <div class="text-overlay" :style="middleTextStyle">
          {{ middleText }}
        </div>
        <div class="text-overlay" :style="bottomTextStyle">
          {{ bottomText }}
        </div>
      </div>
    </div>
    <div class="form_meme">
      <input
        type="text"
        placeholder="titre du meme"
        v-model="title"
      ></input>
      <div class="container_input">
        <input
          type="text"
          placeholder="Texte en haut"
          v-model="topText"
        ></input>
        <input type="color" v-model="topTextColor"></input>
      </div>
      <div class="container_input">
        <input
          type="text"
          placeholder="Texte au milieu"
          v-model="middleText"
        ></input>
        <input type="color" v-model="middleTextColor"></input>
      </div>
      <div class="container_input">
        <input
          type="text"
          placeholder="Texte en bas"
          v-model="bottomText"
        ></input>
        <input type="color" v-model="bottomTextColor"></input>
      </div>

      <button @click="uploadMeme">Enregistrer le meme</button>
    </div>
    <div v-if="resultImage">
      <h3>Résultat:</h3>
      <img
        :src="resultImage"
        alt="Meme généré"
        style="object-fit: contain; max-width: 100%; height: auto"
      />
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      selectedImage: null,
      selectedImageUrl: null,
      title: "",
      topText: "",
      middleText: "",
      bottomText: "",
      topTextColor: "#",
      middleTextColor: "#ffffff",
      bottomTextColor: "#ffffff",
      showFileInput: true,
      resultImage: null,
    };
  }, setup() {
    const router = useRouter();
    return { router };
  },
  
  computed: {
    topTextStyle() {
      return {
        top: "10%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: this.topTextColor,
      };
    },
    middleTextStyle() {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: this.middleTextColor,
      };
    },
    bottomTextStyle() {
      return {
        top: "90%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: this.bottomTextColor,
      };
    },
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedImage = file;
        this.selectedImageUrl = URL.createObjectURL(file);
        this.showFileInput = false;
      }
    },
    async uploadMeme() {
      if (!this.selectedImage) return;

      const formData = new FormData();
      formData.append("image", this.selectedImage);
      formData.append("title", this.title);
      formData.append("topText", this.topText);
      formData.append("topTextColor", this.topTextColor);
      formData.append("middleText", this.middleText);
      formData.append("middleTextColor", this.middleTextColor);
      formData.append("bottomText", this.bottomText);
       formData.append("bottomTextColor", this.bottomTextColor);
      

      try {
        const response = await axios.post("/api/memes", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.resultImage = response.data.imageUrl; 
        this.router.push('/');
      } catch (error) {
        console.error("Error uploading meme:", error);
      }
    },
  },
};
</script>
<style scoped>
.container {
  padding: 100px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 50px;
}
.image-preview-container {
  position: relative;
  display: inline-block;
  max-width: 100%;
}
.image-preview {
  display: block;
  max-width: 100%;
  height: auto;
}
img {
  max-width: 100%;
  width: 1080px;
  height: 1080px;
}
.text-overlay {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 32px;
  font-family: "Arial", sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.img_container {
  flex: 1;
}
.form_meme {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  width: 100%;
}

.container_input {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

input[type="text"],
input[type="file"],
button {
  margin: 5px 0;
}

button {
  width: 100%;
  border: 0;
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 1.15rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.5s ease;
}

button:hover {
  background-color: #338f64;
}

@media (max-width:1000px){
  .container{
    flex-direction: column;
  }
}
</style>
