import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: { translation: require('./locales/en.json') },
  ru: { translation: require('./locales/ru.json') }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: new URLSearchParams(window.location.search).get('locale') || 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
