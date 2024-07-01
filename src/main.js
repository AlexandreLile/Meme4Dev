import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import MyTitle from "./components/MyTitle.vue";

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.component("MyTitle", MyTitle);

app.mount("#app");
