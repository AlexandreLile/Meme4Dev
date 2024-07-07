<template>
  <header>
    <nav>
      <div class="logo">
        <RouterLink to="/"
          ><img src="/public/images/Logomeme4Dev.png" alt=""
        /></RouterLink>
      </div>
      <div class="links" v-if="isAuthenticated">
        <RouterLink to="/créer_un_MEME">Créer un MEME</RouterLink>
        <RouterLink class="logout" to="/logout">Déconnexion</RouterLink>

        <RouterLink class="logout_mobil" to="/logout"
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
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
            />
          </svg>
        </RouterLink>
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
  z-index: 999;
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

.logout_mobil svg {
  color: var(--primary-color);
  width: 30px;
  display: none;
}

@media (max-width: 500px) {
  .logout_mobil svg {
    display: block;
  }
  .logout {
    display: none;
  }
}
</style>
