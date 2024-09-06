import { I18n } from "i18n-js";
import mgTranslation from "./locales/mg.json";
import frTranslation from "./locales/fr.json";
import { preferenceState } from "@/services/AmpelaStates";
import { useSelector } from "@legendapp/state/react";

const i18n = new I18n();

i18n.translations = {
  mg: mgTranslation,
  fr: frTranslation,
};

i18n.enableFallback = true;

export const loadLocale = async () => {
  try {
    const { language } = useSelector(() => preferenceState.get());
    if (language) {
      i18n.locale = language;
    } else {
      i18n.locale = i18n.defaultLocale;
    }
    // const preferenceData = {
    //   language: i18n.locale,
    // };
    // updatePreference(preferenceData);
  } catch (error) {
    
    i18n.locale = i18n.defaultLocale;
  }
};

export default i18n;
