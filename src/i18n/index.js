import gr from "./gr.json";
import en from "./en.json";
import it from "./it.json";
import es from "./es.json";
import se from "./se.json";
import sk from "./sk.json";
import ro from "./ro.json";
import de from "./de.json";

export const defaultLocale = "en";

export const languages = {
  gr: gr,
  en: en,
  it: it,
  es: es,
  se: se,
  sk: sk,
  ro: ro,
  de: de,
};

export const languagesMap = [
  {
    code: "en",
    name: "English",
  },
  {
    code: "gr",
    name: "Ελληνικά",
  },
  {
    code: "it",
    name: "Italiano",
  },
  {
    code: "es",
    name: "Español",
  },
  {
    code: "de",
    name: "Deutsch",
  },
  {
    code: "se",
    name: "Svenska",
  },
  {
    code: "sk",
    name: "Slovak",
  },
  {
    code: "ro",
    name: "Română",
  },
];
