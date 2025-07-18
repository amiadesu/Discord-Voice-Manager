import i18next from 'i18next';

import ru from './locales/ru.json';

export const i18n = i18next.createInstance();

export async function initI18n() {
  await i18n.init({
    lng: 'ru',
    fallbackLng: 'ru',
    resources: {
      ru: { translation: ru }
    },
    interpolation: {
      escapeValue: false
    }
  });
}

export function getI18nObject<T>(key: string): T {
    return i18n.t(key, { returnObjects: true }) as T;
}