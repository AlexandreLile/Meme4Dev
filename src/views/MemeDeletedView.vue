<template>
    <div>
      <h1>Mème supprimé avec succès!</h1>
      <p>Le mème a été supprimé de la base de données.</p>
      <p>Vous serez redirigé automatiquement dans {{ secondsRemaining }} secondes.</p>
      <router-link to="/">Retour à la page d'accueil</router-link>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        secondsRemaining: 10, // Nombre de secondes restantes avant la redirection
        timer: null // Référence du timer
      };
    },
    created() {
      this.startCountdown();
    },
    methods: {
      startCountdown() {
        this.timer = setInterval(() => {
          if (this.secondsRemaining > 0) {
            this.secondsRemaining--;
          } else {
            clearInterval(this.timer);
            // Rediriger automatiquement vers la page d'accueil après le décompte
            this.$router.push('/');
          }
        }, 1000); // Réduire d'une seconde toutes les 1000 ms (1 seconde)
      }
    },
    beforeUnmount() {
      // Assurez-vous d'arrêter le timer lors de la destruction du composant
      clearInterval(this.timer);
    }
  };
  </script>
  