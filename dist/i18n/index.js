"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18n = void 0;
exports.initI18n = initI18n;
exports.getI18nObject = getI18nObject;
const i18next_1 = __importDefault(require("i18next"));
const ru_json_1 = __importDefault(require("./locales/ru.json"));
exports.i18n = i18next_1.default.createInstance();
async function initI18n() {
    await exports.i18n.init({
        lng: 'ru',
        fallbackLng: 'ru',
        resources: {
            ru: { translation: ru_json_1.default }
        },
        interpolation: {
            escapeValue: false
        }
    });
}
function getI18nObject(key) {
    return exports.i18n.t(key, { returnObjects: true });
}
