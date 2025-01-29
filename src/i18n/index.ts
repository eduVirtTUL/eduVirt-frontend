import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import i18next from "i18next";
import pl from "./pl/common";
import en from "./en/common";

export const defaultNS = "common";

i18next
  .use(detector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.MODE === "development",
    fallbackLng: "pl",
    defaultNS,
    resources: {
      pl: {
        common: pl,
        keys: pl,
      },
      en: {
        common: en,
        keys: en,
      },
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18next;
