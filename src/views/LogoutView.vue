<template>
  <div>
    <h1>Déconnexion</h1>
    <p>Vous avez été déconnecté.</p>
  </div>
</template>

<script>
export default {
  created() {
    localStorage.removeItem("isAuthenticated");
    this.$router.push("/login");
  },
};
</script>
