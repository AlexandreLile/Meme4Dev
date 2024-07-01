<template>
  <section>
    <MyTitle tag="h1">Authentification</MyTitle>
    <MyTitle tag="h2">Créez vos meilleurs <strong>MEME</strong></MyTitle>
    <form @submit.prevent="login">
      <input
        type="password"
        v-model="password"
        id="password"
        placeholder="Mot de passe"
      />
      <button type="submit">
        Se connecter
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
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </button>
    </form>
    <p v-if="error">{{ error }}</p>

    <div class="login_txt">
      <img src="/public/images/Logo_login.png" alt="" />
      <div class="content_login">
        <MyTitle tag="h2"><strong>Meme4Dev</strong></MyTitle>
        <p>
          Votre application qui permet de créer rapidement et facilement des
          <strong>MEMES</strong> sur mesure. Faites parler votre créativité en
          amusant la galerie.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      error: "",
    };
  },
  methods: {
    login() {
      const correctPassword = import.meta.env.VITE_APP_PASSWORD;
      //   console.log("Mot de passe :", correctPassword);
      if (this.password === correctPassword) {
        localStorage.setItem("isAuthenticated", "true");
        this.$router.push("/");
      } else {
        this.error = "Mot de passe incorrect";
      }
    },
  },
};
</script>
<style scoped>
section {
  width: 100%;
  padding-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
  max-width: 700px;
  margin: 0 auto;
}
form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;
  gap: 25px;
}

input {
  width: 100%;
  height: 2.5rem;
  padding: 5px 0 5px 15px;
  border-radius: 0.25rem;
  font-size: 1rem;
  color: var(--primary-color);
  font-weight: 300;
  border: 0;
  box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.3);
  background-color: var(--light);
  outline: none;
}
input::placeholder {
  color: var(--primary-color);
  font-size: 1rem;
  font-weight: 200;
}

button {
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

button svg {
  width: 20px;
}

button:hover {
  background-color: #338f64;
}

.login_txt {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  padding-top: 70px;
}

.content_login {
  gap: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.content_login p {
  line-height: 1.5;
}
</style>
