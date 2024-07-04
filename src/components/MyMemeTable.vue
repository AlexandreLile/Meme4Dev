<template>
  <div class="container">
    <div class="search">
      <MyTitle tag="h2">Vos <strong>MEMES</strong></MyTitle>
      <input type="search" v-model="searchMeme" placeholder="Recherche" />
    </div>
    <div class="grid">
      <div v-for="meme in sortedMemes" :key="meme.id">
        <img :src="meme.imgUrl" alt="" @click="showMeme(meme)" />
        <h3>{{ meme.title }}</h3>
        <button @click="confirmDeleteMeme(meme.id)">Supprimer</button>
      </div>
    </div>

    <!-- Boîte de dialogue de confirmation -->
    <div v-if="showConfirmationDialog" class="confirmation-dialog dialog-container">
      <p>Êtes-vous sûr de vouloir supprimer définitivement ce mème ?</p>
      <button @click="deleteMeme">Oui</button>
      <button @click="cancelDelete">Annuler</button>
    </div>

    <!-- Modal pour afficher le meme en grand -->
    <div v-if="showMemeModal" class="meme-modal" @click="closeMemeModal">
      <div class="meme-modal-content" @click.stop>
        <span class="close" @click="closeMemeModal">&times;</span>
        <img :src="selectedMeme.imgUrl" alt="" />
        <h3>{{ selectedMeme.title }}</h3>
      </div>
    </div>
  </div>
</template>



<script>
import MyTitle from "./MyTitle.vue";
import axios from "axios";

export default {
  data() {
    return {
      searchMeme: "",
      memes: [],
      showConfirmationDialog: false,
      memeToDeleteId: null,
      showMemeModal: false,
      selectedMeme: null,
    };
  },
  components: {
    MyTitle,
  },
  created() {
    this.fetchMemes();
  },
  methods: {
    fetchMemes() {
      axios.get("/api/memes")
        .then((response) => {
          this.memes = response.data;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des mèmes:", error);
        });
    },
    confirmDeleteMeme(id) {
      console.log("Confirm delete meme with ID:", id);
      this.memeToDeleteId = id;
      this.showConfirmationDialog = true;
    },
    deleteMeme() {
      if (this.memeToDeleteId) {
        axios.delete(`/api/memes/${this.memeToDeleteId}`)
          .then(() => {
            // Mise à jour locale des mèmes après suppression
            this.memes = this.memes.filter((meme) => meme.id !== this.memeToDeleteId);
            // Réinitialisation
            this.cancelDelete();
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression du mème:", error);
            // Réinitialisation en cas d'erreur
            this.cancelDelete();
          });
      }
    },
    cancelDelete() {
      this.memeToDeleteId = null;
      this.showConfirmationDialog = false;
    },
    showMeme(meme) {
      this.selectedMeme = meme;
      this.showMemeModal = true;
    },
    closeMemeModal() {
      this.showMemeModal = false;
      this.selectedMeme = null;
    },
  },
  computed: {
    sortedMemes() {
      if (!this.searchMeme) {
        return this.memes;
      }
      return this.memes.filter((meme) =>
        meme.title.toLowerCase().includes(this.searchMeme.toLowerCase())
      );
    },
  },
  watch: {
    memes: {
      handler(newMemes, oldMemes) {
        // Exemple : Déclencher une action après la suppression d'un mème
        if (newMemes.length < oldMemes.length) {
          this.fetchMemes(); // Réactualiser les mèmes après une suppression
        }
      },
      deep: true, // Surveiller les changements profonds dans le tableau memes
    },
  },
};
</script>








<style scoped>
.confirmation-dialog {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
}
.dialog-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999; /* Assurez-vous que la boîte de dialogue est au-dessus de tout le reste */
  background-color: white; /* Fond blanc ou autre couleur de votre choix */
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  padding-bottom: 70px;
}

.search input {
  max-width: 360px;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  background-color: var(--light);
  border: 0;
  padding: 0.75rem;
  box-shadow: 0 5px 4px rgba(0, 0, 0, 0.3);
  outline: none;
}

.search input::placeholder {
  color: var(--primary-color);
  font-size: 1rem;
  font-weight: 200;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 25px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 50px;
}

.grid img {
  border-radius: 1rem;
  width: 100%;
  position: relative;
}

.grid img::after {
  content: "";
  position: absolute;
  background-color: var(--primary-color);
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.grid div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.meme-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.meme-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  position: relative;
}

.meme-modal-content img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 10px;
}

.meme-modal-content .close {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 2rem;
  cursor: pointer;
}
</style>


