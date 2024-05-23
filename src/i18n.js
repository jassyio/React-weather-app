import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Weather": "Weather",
      "Search": "Search",
      "Enter location": "Enter location",
      "Voice Search": "Voice Search",
      "Temperature": "Temperature",
      "Humidity": "Humidity",
      "Wind": "Wind",
      "Loading...": "Loading...",
      "Feels like": "Feels like",
      "clear sky": "clear sky",
      "few clouds": "few clouds",
      "scattered clouds": "scattered clouds",
      "broken clouds": "broken clouds",
      "shower rain": "shower rain",
      "light rain": "light rain",
      "rain": "rain",
      "thunderstorm": "thunderstorm",
      "snow": "snow",
      "mist": "mist"
      // Add other translations
    }
  },
  fr: {
    translation: {
      "Weather": "Météo",
      "Search": "Chercher",
      "Enter location": "Entrer le lieu",
      "Voice Search": "Recherche vocale",
      "Temperature": "Température",
      "Humidity": "Humidité",
      "Wind": "Vent",
      "Loading...": "Chargement...",
      "Feels like": "Ressenti",
      "clear sky": "ciel dégagé",
      "few clouds": "quelques nuages",
      "scattered clouds": "nuages épars",
      "broken clouds": "nuages fragmentés",
      "shower rain": "averse",
      "light rain": "pluie légère",
      "rain": "pluie",
      "thunderstorm": "orage",
      "snow": "neige",
      "mist": "brume"
      // Add other translations
    }
  },
  es: {
    translation: {
      "Weather": "Clima",
      "Search": "Buscar",
      "Enter location": "Ingresar ubicación",
      "Voice Search": "Búsqueda por voz",
      "Temperature": "Temperatura",
      "Humidity": "Humedad",
      "Wind": "Viento",
      "Loading...": "Cargando...",
      "Feels like": "Se siente como",
      "clear sky": "cielo claro",
      "few clouds": "pocas nubes",
      "scattered clouds": "nubes dispersas",
      "broken clouds": "nubes rotas",
      "shower rain": "lluvia de ducha",
      "light rain": "lluvia ligera",
      "rain": "lluvia",
      "thunderstorm": "tormenta",
      "snow": "nieve",
      "mist": "niebla"
      // Add other translations
    }
  },
  ru: {
    translation: {
      "Weather": "Погода",
      "Search": "Поиск",
      "Enter location": "Введите местоположение",
      "Voice Search": "Поиск по голосу",
      "Temperature": "Температура",
      "Humidity": "Влажность",
      "Wind": "Ветер",
      "Loading...": "Загрузка...",
      "Feels like": "Ощущается как",
      "clear sky": "ясное небо",
      "few clouds": "мало облаков",
      "scattered clouds": "рассеянные облака",
      "broken clouds": "разбитые облака",
      "shower rain": "дождь с душем",
      "light rain": "легкий дождь",
      "rain": "дождь",
      "thunderstorm": "гроза",
      "snow": "снег",
      "mist": "туман"
      // Add other translations
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
