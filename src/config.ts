import { GatewayIntentBits, Collection, ButtonStyle } from 'discord.js';
import GuildConfig from './types/GuildConfig';
import dotenv from 'dotenv';

dotenv.config();

export const internal = {
    token: process.env.DISCORD_TOKEN || '', // Токен бота (https://discord.com/developers/applications)
    mongoURL: process.env.MONGODB_URL || '' // Ссылка на базы данных MongoDB (https://www.mongodb.com/)
};

export const intents: GatewayIntentBits[] | number = 131071; // Все интенты

export const cooldownVoiceJoin: number = 0;

const embedColor = process.env.EMBED_COLOR
    ? Number(process.env.EMBED_COLOR)
    : 0x2f3136;

export const guilds = new Collection<string, GuildConfig>().set(
    process.env.GUILD_ID || '', // ID Сервера
    {
        defaultName: '⭐ {username}', // Дефолтное название комнаты (username это ник участника, можете убрать этот параметр, тогда будет просто ник участника)
        message: process.env.MESSAGE_ID || '', // ID Сообщения (если сообщения нет, оставляете путсым, до заполнения)
        style: ButtonStyle.Secondary, // Стиль кнопок (выбирать из предложенных от класса)
        channels: {
            text: process.env.TEXT_CHANNEL_ID || '', // ID канала где расположится панель управления
            voice: process.env.VOICE_CHANNEL_ID || '', // ID голосового канала приваток
            category: process.env.CATEGORY_CHANNEL_ID || '' // ID категории где будут создаваться приватные комнаты
        },
        line: undefined, // Линия в панели управления (сейчас она не стоит, чтобы её поставить впишите "'https://...'" вместо "undefined")
        color: embedColor, // Цвет embed'а сообщений
        dot: undefined, // Эмодзи перед эмодзи в панели комнаты (сейчас эмодзи не стоит, чтобы поставить впишите "'✏️'" вместо "undefined")
        buttons: { // Эмодзи и их описание :)
            'rename': { emoji: '✏️', title: 'Изменить название комнаты' },
            'limit': { emoji: '👥', title: 'Установить лимит пользователей' },
            'close': { emoji: '🔒', title: 'Закрыть/открыть доступ в комнату' },
            'hide': { emoji: '👁️', title: 'Скрыть/раскрыть комнату для всех' },
            'user': { emoji: '💋', title: 'Забрать/выдать доступ к комнате пользователю' },
            'speak': { emoji: '🔈', title: 'Забрать/выдать право говорить пользователю' },
            'kick': { emoji: '🤢', title: 'Выгнать пользователя из комнаты' },
            'reset': { emoji: '✂️', title: 'Сбросить права пользователю' },
            'owner': { emoji: '👑', title: 'Сделать пользователя новым владельцем' },
            'info': { emoji: '📔', title: 'Информация о комнате' }
        },
        placeholder: { // Заголовки у меню при выборе пользователя или канала
            user: '🔷 Выберите пользователя',
            channel: '🔷 Выберите приватную комнату'
        }
    }
);
