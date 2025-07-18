import { GatewayIntentBits, Collection, ButtonStyle } from 'discord.js';
import GuildConfig from './types/GuildConfig';
import dotenv from 'dotenv';

dotenv.config();

export const internal = {
    token: process.env.DISCORD_TOKEN || '',
    mongoURL: process.env.MONGODB_URL || ''
};

export const intents: GatewayIntentBits[] | number = 131071;

export const cooldownVoiceJoin: number = 0;

const embedColor = process.env.EMBED_COLOR
    ? Number(process.env.EMBED_COLOR)
    : 0x2f3136;

export const guilds = new Collection<string, GuildConfig>().set(
    process.env.GUILD_ID || '',
    {
        defaultName: '⭐ {username}',
        message: process.env.MESSAGE_ID || '',
        style: ButtonStyle.Secondary,
        channels: {
            text: process.env.TEXT_CHANNEL_ID || '',
            voice: process.env.VOICE_CHANNEL_ID || '',
            category: process.env.CATEGORY_CHANNEL_ID || ''
        },
        line: undefined,
        color: embedColor,
        dot: undefined,
        buttons: {
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
        placeholder: {
            user: '🔷 Выберите пользователя',
            channel: '🔷 Выберите приватную комнату'
        }
    }
);
