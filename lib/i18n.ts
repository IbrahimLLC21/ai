// config/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import en from '../public/locales/en/translation.json';
import fr from '../public/locales/fr/translation.json';
import de from '../public/locales/de/translation.json';
import zh from '../public/locales/zh/translation.json';
import ar from '../public/locales/ar/translation.json';
import nl from '../public/locales/nl/translation.json';
import vi from '../public/locales/vi/translation.json';
import hu from '../public/locales/hu/translation.json';
import bs from '../public/locales/bs/translation.json';
import es from '../public/locales/es/translation.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      de: { translation: de },
      zh: { translation: zh },
      ar: { translation: ar },
      nl: { translation: nl },
      vi: { translation: vi },
      hu: { translation: hu },
      bs: { translation: bs },
      es: { translation: es },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
