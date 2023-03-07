import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './locales/uk/translations';
import en from './locales/en/translations';

export const initI18n = () => {
  i18n.use(initReactI18next).init({
    resources: {
      uk,
      en,
    },
    lng: 'uk',
    fallbackLng: 'en',
  });
};
