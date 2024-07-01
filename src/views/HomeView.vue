<template>
  <main>
    <div class="container_title">
      <MyTitle tag="h1">Créer votre <strong>MEME</strong> personnalisé</MyTitle>
      <MyLink></MyLink>
    </div>
    <MyMemeTable></MyMemeTable>
  </main>
</template>

<script>
import MyTitle from "../components/MyTitle.vue";
import MyLink from "../components/MyLink.vue";
import MyMemeTable from "../components/MyMemeTable.vue";
export default {
  data() {
    return {};
  },
  components: {
    MyTitle,
    MyLink,
    MyMemeTable,
  },
};
</script>

<style scoped>
.container_title {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 25px;
  padding-top: 100px;
}
</style>
