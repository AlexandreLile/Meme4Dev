<template>
  <component :is="tag">
    <slot></slot>
  </component>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    tag: {
      type: String,
      default: "h1",
      validator: (value) =>
        ["h1", "h2", "h3", "h4", "h5", "h6"].includes(value),
    },
  },
};
</script>

<style scoped>
h1 {
  color: var(--dark);
  font-size: 2.5rem;
  font-weight: 600;
}

h2 {
  color: var(--dark);
  font-size: 1.5rem;
  font-weight: 500;
}
</style>
