import i18n from "i18next";
import { initReactI18next } from "react-i18next";
//Тут загружає translations (переклади мабуть) тут інші модулі можуть перекладати. Він викорстовує переклад використовуючи http-requests. ОТже я можу завантажити його з віддаленого сервера.
import Backend from "i18next-http-backend";
//Цей модуль визначає мову для нас
import LanguageDetector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
    },
  },
};

/* i18n
	.use(Backend)
	.use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
	}); */

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    //debug: true - покаже всі console.log() - що приходять з i18next - а false - рпиховає
    debug: false,
    detection: {
      order: ["queryString", "cookie"],
      cache: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    defaultNS: "translation",
  });

export default i18n;
