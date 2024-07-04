<template>
  <div v-if="showFileInput">
    <input type="file" @change="handleFileChange" accept="image/*" />
  </div>
  <div class="container">
    <div class="container_canvas">
      <canvas id="canvas"></canvas>
    </div>

    <div class="form_meme">
      <input type="text" v-model="title" placeholder="Titre du meme" />
      <div>
        <input type="text" v-model="topText.content" placeholder="Texte en haut" />
        <input type="color" v-model="topText.color" />
      </div>
      <div>
        <input type="text" v-model="middleText.content" placeholder="Texte au milieu" />
        <input type="color" v-model="middleText.color" />
      </div>
      <div>
        <input type="text" v-model="bottomText.content" placeholder="Texte en bas" />
        <input type="color" v-model="bottomText.color" />
      </div>
      <button @click="generateMeme">Générer Meme</button>
      <button @click="uploadMeme">Uploader Meme</button>
    </div>
  </div>
  <div v-if="resultImage">
    <h3>Résultat:</h3>
    <img
      :src="resultImage"
      alt="Meme généré"
      style="object-fit: contain; max-width: 100%; height: auto"
    />
  </div>
</template>

<script>
import { Canvas, Image as FabricImage, Text as FabricText } from "fabric";
import axios from "axios";

export default {
  data() {
    return {
      selectedImage: null,
      title: "",
      topText: {
        content: "",
        color: "#ffffff",
        position: "top",
      },
      middleText: {
        content: "",
        color: "#ffffff",
        position: "middle",
      },
      bottomText: {
        content: "",
        color: "#ffffff",
        position: "bottom",
      },
      canvas: null,
      showFileInput: true,
      resultImage: null,
      fabricImgInstance: null,
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedImage = event.target.files[0];
      this.showFileInput = false; // Hide file input after selection

      const reader = new FileReader();
      reader.onload = (e) => {
        const imgObj = new Image();
        imgObj.src = e.target.result;
        imgObj.onload = () => {
          const scaleFactor = Math.min(
            this.canvas.getWidth() / imgObj.width,
            this.canvas.getHeight() / imgObj.height
          );

          const fabricImg = new FabricImage(imgObj, {
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            left: (this.canvas.getWidth() - imgObj.width * scaleFactor) / 2,
            top: (this.canvas.getHeight() - imgObj.height * scaleFactor) / 2,
          });

          this.fabricImgInstance = fabricImg; // Save reference for later manipulation
          this.canvas.add(fabricImg);
          this.canvas.renderAll();
        };
      };
      reader.readAsDataURL(this.selectedImage);
    },
    generateMeme() {
      // Clear previous texts and generate new texts
      this.canvas.clear();

      if (this.fabricImgInstance) {
        this.canvas.add(this.fabricImgInstance);
      }

      this.drawText(this.topText);
      this.drawText(this.middleText);
      this.drawText(this.bottomText);

      const dataURL = this.canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      this.resultImage = dataURL; // Save result image to display later
    },
    drawText(textObj) {
      const { content, color, position } = textObj;

      let topPosition = 10; // Default top position
      switch (position) {
        case "middle":
          topPosition = this.canvas.getHeight() / 2;
          break;
        case "bottom":
          topPosition = this.canvas.getHeight() - 40;
          break;
        default:
          topPosition = 10;
          break;
      }

      const fabricText = new FabricText(content, {
        left: this.canvas.getWidth() / 2,
        top: topPosition,
        fontSize: 32,
        fill: color,
        textAlign: "center",
        originX: "center",
      });

      this.canvas.add(fabricText);
    },
    uploadMeme() {
      if (!this.resultImage) return;
      const formData = new FormData();
      formData.append("image", this.dataURLtoBlob(this.resultImage));
      formData.append("title", this.title);
      formData.append("topText", this.topText.content);
      formData.append("middleText", this.middleText.content);
      formData.append("bottomText", this.bottomText.content);

      axios
        .post("/api/memes", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Meme uploaded successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error uploading meme:", error);
        });
    },
    dataURLtoBlob(dataURL) {
      const byteString = atob(dataURL.split(",")[1]);
      const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
  },
  mounted() {
    this.canvas = new Canvas("canvas");
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 15px;
}
.container_canvas {
  width: 100%;
  max-width: 100%; /* Limit canvas width */
  height: 100%;
  flex: 1;
}
#canvas {
  height: 100%;
  width: 100%;
  border: 1px solid #ccc;
}
.form_meme {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
}
input,
button,
select {
  margin: 10px;
}
</style>
