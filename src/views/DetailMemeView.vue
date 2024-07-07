<template>
  <div class="container">
    <MyTitle tag="h1">Détail du <strong>MEME</strong></MyTitle>

    <img :src="meme.imgUrl" alt="" />

    <MyTitle tag="h3"> Titre du MEME : {{ meme.title }}</MyTitle>
    <div class="container_btn">
      <a :href="meme.imgUrl" download="meme.png">Télécharger</a>
      <button class="delete_btn" @click="deleteMeme(meme.id)">Supprimer</button>
    </div>
  </div>
</template>

<script>
import MyTitle from "@/components/MyTitle.vue";
import axios from "axios";

export default {
  data() {
    return {
      meme: {},
    };
  },
  created() {
    const id = this.$route.params.id;
    axios
      .get(`/api/memes/${id}`)
      .then((response) => {
        this.meme = response.data;
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du mème:", error);
      });
  },
  methods: {
    deleteMeme(id) {
      axios
        .delete(`/api/memes/${id}`)
        .then(() => {
          // Redirection vers la page de confirmation après la suppression
          this.$router.push({ name: "MemeDeleted", params: { id } });
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression du mème:", error);
        });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
  padding: 50px 20px;
  gap: 25px;
}

.container img {
  max-width: 600px;
  border-radius: 1rem;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.4);
  width: 100%;
}

.container h3 {
  text-align: center;
  font-size: 2rem;
}

button,
a {
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

button:hover a:hover {
  background-color: #338f64;
}

.container_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.delete_btn {
  background-color: #ff3636;
}
</style>
