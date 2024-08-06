import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import fr from "../locales/fr.json";

type Language = "en" | "fr";
const LANGAGUE_ACCEPTED: Record<string, Language> = {
  en: "en",
  fr: "fr",
};
const navigatorLanguage = navigator.language.split("-")[0];
const language = LANGAGUE_ACCEPTED[navigatorLanguage] || "en";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

const initializei18n = () => {
  i18n.use(initReactI18next).init({
    resources,
    lng: language,
    interpolation: {
      escapeValue: false,
    },
  });
};

export default initializei18n;
