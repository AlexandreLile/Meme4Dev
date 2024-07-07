<template>
  <div class="container">
    <div class="search">
      <MyTitle tag="h2">Vos <strong>MEMES</strong></MyTitle>
      <input type="search" v-model="searchMeme" placeholder="Recherche" />
    </div>
    <div class="grid">
      <div class="grid_item" v-for="meme in sortedMemes" :key="meme.id">
        <img :src="meme.imgUrl" alt="" @click="showMeme(meme)" />
        <h3>{{ meme.title }}</h3>
        <div class="container_btn">
          <button @click="viewMeme(meme.id)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
          <button @click="confirmDeleteMeme(meme.id)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
          <a :href="meme.imgUrl" download="meme.png"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Boîte de dialogue de confirmation -->
    <div
      v-if="showConfirmationDialog"
      class="confirmation-dialog dialog-container"
    >
      <p>Êtes-vous sûr de vouloir supprimer définitivement ce mème ?</p>
      <div class="btn_modal">
        <button class="delete_btn" @click="deleteMeme">Supprimer</button>
        <button @click="cancelDelete">Annuler</button>
      </div>
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
      axios
        .get("/api/memes")
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
        axios
          .delete(`/api/memes/${this.memeToDeleteId}`)
          .then(() => {
            // Mise à jour locale des mèmes après suppression
            this.memes = this.memes.filter(
              (meme) => meme.id !== this.memeToDeleteId
            );
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
    downloadMeme() {
      // Vérifier que resultImage contient l'URL de l'image générée
      if (!this.resultImage) {
        console.error("Aucune image à télécharger.");
        return;
      }

      // Construire l'élément <a> avec l'attribut download pour télécharger l'image
      const downloadLink = document.createElement("a");
      downloadLink.href = this.resultImage;
      downloadLink.download = "meme.png"; // Nom du fichier à télécharger

      // Ajouter l'élément <a> à la page et cliquer dessus pour démarrer le téléchargement
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink); // Nettoyer après le téléchargement
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
    viewMeme(id) {
      axios
        .get(`/api/memes/${id}`)
        .then((response) => {
          // Rediriger l'utilisateur vers une autre page pour afficher le meme
          this.$router.push({ name: "MemeDetail", params: { id: id } });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du mème:", error);
        });
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
button svg,
a svg {
  width: 25px;
}

.container_btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.container_btn button {
  background-color: var(--primary-color);
  border: 0;
  padding: 5px;
  border-radius: 0.25rem;
  color: var(--light);
  cursor: pointer;
}

.container_btn a {
  background-color: var(--primary-color);
  border: 0;
  padding: 5px;
  border-radius: 0.25rem;
  color: var(--light);
  cursor: pointer;
}
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

.grid > div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
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
  padding: 50px;
  border-radius: 10px;
  text-align: center;
  position: relative;
}

.meme-modal-content h3 {
  font-size: 1.5rem;
  padding-top: 15px;
}

.meme-modal-content img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 10px;
}

.meme-modal-content .close {
  position: absolute;
  top: 4%;
  left: 96%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  cursor: pointer;
  color: var(--primary-color);
}

.confirmation-dialog {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.btn_modal {
  display: flex;

  gap: 15px;
}

.btn_modal button {
  width: 100%;
  border: 0;
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 1.15rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;

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

.btn_modal .delete_btn {
  background-color: #ff3636;
}
</style>
