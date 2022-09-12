import { createApp } from "vue";
import App from "./App.vue";
import VueGtag from "vue-gtag";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/app.scss";

createApp(App)
  .use(VueGtag, {
    config: {
      id: import.meta.env.VITE_GA_MEASUREMENT_ID,
      params: {
        anonymize_ip: true,
      },
    },
  })
  .mount("#app");
