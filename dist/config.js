"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cooldownVoiceJoin = exports.intents = exports.internal = void 0;
exports.initializeGuildConfig = initializeGuildConfig;
exports.getGuilds = getGuilds;
const discord_js_1 = require("discord.js");
const i18n_1 = require("./i18n");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.internal = {
    token: process.env.DISCORD_TOKEN || '', // Токен бота (https://discord.com/developers/applications)
    mongoURL: process.env.MONGODB_URL || '' // Ссылка на базы данных MongoDB (https://www.mongodb.com/)
};
exports.intents = 131071; // Все интенты
exports.cooldownVoiceJoin = 0;
const embedColor = process.env.EMBED_COLOR
    ? Number(process.env.EMBED_COLOR)
    : 0x2f3136;
let guilds;
function initializeGuildConfig() {
    guilds = new discord_js_1.Collection().set(process.env.GUILD_ID || '', // ID Сервера
    {
        defaultName: '⭐ {username}', // Дефолтное название комнаты (username это ник участника, можете убрать этот параметр, тогда будет просто ник участника)
        message: process.env.MESSAGE_ID || '', // ID Сообщения (если сообщения нет, оставляете путсым, до заполнения)
        style: discord_js_1.ButtonStyle.Secondary, // Стиль кнопок (выбирать из предложенных от класса)
        channels: {
            text: process.env.TEXT_CHANNEL_ID || '', // ID канала где расположится панель управления
            voice: process.env.VOICE_CHANNEL_ID || '', // ID голосового канала приваток
            category: process.env.CATEGORY_CHANNEL_ID || '' // ID категории где будут создаваться приватные комнаты
        },
        line: undefined, // Линия в панели управления (сейчас она не стоит, чтобы её поставить впишите "'https://...'" вместо "undefined")
        color: embedColor, // Цвет embed'а сообщений
        dot: undefined, // Эмодзи перед эмодзи в панели комнаты (сейчас эмодзи не стоит, чтобы поставить впишите "'✏️'" вместо "undefined")
        buttons: (0, i18n_1.getI18nObject)('buttons'), // Эмодзи и их описание :)
        placeholder: (0, i18n_1.getI18nObject)('placeholders') // Заголовки у меню при выборе пользователя или канала
    });
}
function getGuilds() {
    if (!guilds) {
        initializeGuildConfig();
    }
    return guilds;
}
