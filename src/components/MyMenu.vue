<template>
  <header>
    <nav>
      <div class="logo">
        <RouterLink to="/"
          ><img src="/public/images/Logomeme4Dev.png" alt=""
        /></RouterLink>
      </div>
      <div class="links" v-if="isAuthenticated">
        <RouterLink to="/about">Créer un MEME</RouterLink>
        <RouterLink to="/logout">Déconnexion</RouterLink>
      </div>
    </nav>
  </header>
  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
export default {
  data() {
    return { isAuthenticated: false };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      this.isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    },
  },
  watch: {
    $route(to, from) {
      this.checkAuthentication();
    },
  },
};
</script>

<style scoped>
header {
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--light);
  padding: 0.5rem 1.5rem;
}

header nav a img {
  width: 55px;
  object-fit: contain;
}

header nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
}

.links a {
  color: var(--primary-color);
  font-size: 1.25rem;
  font-weight: 700;
}
</style>
