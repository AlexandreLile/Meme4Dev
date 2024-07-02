<template>
    <main>
      <div class="container_title">
        <MyTitle tag="h1">Détail du <strong>MEME</strong></MyTitle>
        <MyLink></MyLink>
        <div>
          <img :src="meme.imgUrl" alt="" />
          <h1>{{ meme.title }}</h1>
          <button @click="deleteMeme(meme.id)">Supprimer</button>
        </div>
      </div>
    </main>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        meme: {},
      };
    },
    created() {
      const id = this.$route.params.id;
      axios.get(`/api/memes/${id}`).then((response) => {
        this.meme = response.data;
      }).catch(error => {
        console.error('Erreur lors de la récupération du mème:', error);
      });
    },
    methods: {
      deleteMeme(id) {
        axios.delete(`/api/memes/${id}`).then(() => {
          // Redirection vers la page de confirmation après la suppression
          this.$router.push({ name: 'MemeDeleted', params: { id } });
        }).catch(error => {
          console.error('Erreur lors de la suppression du mème:', error);
        });
      },
    },
  };
  </script>
  