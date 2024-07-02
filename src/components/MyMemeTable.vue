<template>
  <div class="container">
    <div class="search">
      <MyTitle tag="h2">Vos <strong>MEMES</strong></MyTitle>
      <input type="search" v-model="searchMeme" placeholder="Recherche" />
    </div>
    <div class="grid">
      <div v-for="meme in sortedMemes" :key="meme.id">
        <img :src="meme.imgUrl" alt="" @click="viewMeme(meme.id)" />
        <h3>{{ meme.title }}</h3>
        <button @click="deleteMeme(meme.id)">Supprimer</button>
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
    deleteMeme(id) {
      axios.delete(`/api/memes/${id}`)
        .then(() => {
          // Mise à jour locale des mèmes après suppression
          this.memes = this.memes.filter((meme) => meme.id !== id);
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression du mème:", error);
        });
    },
    viewMeme(id) {
      this.$router.push(`/memes/${id}`);
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
</style>
