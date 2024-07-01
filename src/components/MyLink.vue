<template>
  <routerLink :to="link" class="btn"
    >{{ text }}
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
  </routerLink>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    text: {
      type: String,
      default: "Mon super lien",
      required: true,
    },

    link: {
      type: String,
      default: "/about",
      required: true,
    },
  },
};
</script>

<style scope>
.btn {
  background-color: var(--primary-color);
  color: var(--white);
  font-size: 1.15rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  width: fit-content;
  gap: 10px;
  transition: all 0.5s ease;
}
.btn svg {
  width: 20px;
}

.btn:hover {
  background-color: #338f64;
}
</style>
