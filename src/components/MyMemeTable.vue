<template>
  <div class="container">
    <div class="search">
      <MyTitle tag="h2">Vos <strong>MEMES</strong></MyTitle>
      <input type="search" v-model="searchMeme" placeholder="Recherche" />
    </div>
    <div class="grid">
      <div v-for="(meme, index) in sortedMeme" :key="index">
        <img :src="meme.imgUrl" alt="" />
        <h3>{{ meme.title }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import MyTitle from "./MyTitle.vue";
export default {
  data() {
    return {
      searchMeme: "",
      memes: [
        {
          imgUrl: "/public/images/meme.webp",
          title: "Mon meme 1",
        },
        {
          imgUrl: "/public/images/meme.webp",
          title: "Mon titre 2",
        },
        {
          imgUrl: "/public/images/meme.webp",
          title: "Mon idée 3",
        },
        {
          imgUrl: "/public/images/meme.webp",
          title: "Mon titre 4",
        },
        {
          imgUrl: "/public/images/meme.webp",
          title: "Mon titre 4",
        },
      ],
    };
  },
  components: {
    MyTitle,
  },
  computed: {
    sortedMeme() {
      if (!this.searchMeme) {
        return this.memes;
      }
      return [...this.memes].sort((a, b) => {
        const aMatch = a.title
          .toLowerCase()
          .includes(this.searchMeme.toLowerCase());
        const bMatch = b.title
          .toLowerCase()
          .includes(this.searchMeme.toLowerCase());
        return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
      });
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
