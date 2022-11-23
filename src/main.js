import { createApp } from "vue";
import App from "./App.vue";
import VueGtag from "vue-gtag";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/app.scss";
import { createI18n } from "vue-i18n";
import { languages } from "./i18n";
import { defaultLocale } from "./i18n";
import mitt from "mitt";

const messages = Object.assign(languages);
const globalEventBus = mitt();

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
  warnHtmlInMessage: "off",
});

const app = createApp(App)
  .use(VueGtag, {
    config: {
      id: import.meta.env.VITE_GA_MEASUREMENT_ID,
      params: {
        anonymize_ip: true,
      },
    },
  })
  .use(i18n);
app.config.globalProperties.globalEventBus = globalEventBus;
app.mount("#app");
