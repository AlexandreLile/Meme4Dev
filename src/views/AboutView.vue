<template>
  <div v-if="showFileInput">
    <input type="file" @change="handleFileChange" accept="image/*" />
  </div>
  <div class="container">
    <div class="container_canvas">
      <canvas id="canvas"></canvas>
    </div>

    <div class="form_meme">
      <input type="text" v-model="topText" placeholder="Texte en haut" />
      <input type="text" v-model="middleText" placeholder="Texte au milieu" />
      <input type="text" v-model="bottomText" placeholder="Texte en bas" />
      <button @click="generateMeme">Générer Meme</button>
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

export default {
  data() {
    return {
      selectedImage: null,
      topText: "",
      middleText: "",
      bottomText: "",
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

      if (this.topText) {
        const topText = new FabricText(this.topText, {
          left: this.canvas.getWidth() / 2,
          top: 10,
          fontSize: 32,
          fill: "white",
          textAlign: "center",
          originX: "center",
        });
        this.canvas.add(topText);
      }

      if (this.middleText) {
        const middleText = new FabricText(this.middleText, {
          left: this.canvas.getWidth() / 2,
          top: this.canvas.getHeight() / 2,
          fontSize: 32,
          fill: "white",
          textAlign: "center",
          originX: "center",
        });
        this.canvas.add(middleText);
      }

      if (this.bottomText) {
        const bottomText = new FabricText(this.bottomText, {
          left: this.canvas.getWidth() / 2,
          top: this.canvas.getHeight() - 40,
          fontSize: 32,
          fill: "white",
          textAlign: "center",
          originX: "center",
        });
        this.canvas.add(bottomText);
      }

      const dataURL = this.canvas.toDataURL({
        format: "png",
        quality: 1,
      });

      this.resultImage = dataURL; // Save result image to display later
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
button {
  margin: 10px;
}
</style>
