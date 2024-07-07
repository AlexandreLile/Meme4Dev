<template>
  <div class="container">
    <div class="content">
      <h1>Mème supprimé avec succès!</h1>
      <p>Le mème a été supprimé de la base de données.</p>
      <p>
        Vous serez redirigé automatiquement dans
        <strong>{{ secondsRemaining }}</strong> secondes.
      </p>
      <MyLink text="Accueil" link="/"></MyLink>
    </div>
  </div>
</template>

<script>
import MyLink from "../components/MyLink.vue";
export default {
  data() {
    return {
      secondsRemaining: 1000, // Nombre de secondes restantes avant la redirection
      timer: null, // Référence du timer
    };
  },
  created() {
    this.startCountdown();
  },
  components: {
    MyLink,
  },
  methods: {
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.secondsRemaining > 0) {
          this.secondsRemaining--;
        } else {
          clearInterval(this.timer);
          // Rediriger automatiquement vers la page d'accueil après le décompte
          this.$router.push("/");
        }
      }, 1000); // Réduire d'une seconde toutes les 1000 ms (1 seconde)
    },
  },
  beforeUnmount() {
    // Assurez-vous d'arrêter le timer lors de la destruction du composant
    clearInterval(this.timer);
  },
};
</script>
<style scoped>
.container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 50px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
