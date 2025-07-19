"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const Utils_1 = __importDefault(require("./Utils"));
const i18n_1 = require("../../i18n");
class EmbedBuilder extends discord_js_1.EmbedBuilder {
    default(member, title, description) {
        return this.setTitle(title).setColor((0, config_1.getGuilds)().get(member.guild.id).color)
            .setDescription(`${member.toString()}, ${description}`)
            .setThumbnail(Utils_1.default.getAvatar(member));
    }
    settingRoomEmbed(config) {
        const buttonOrder = [
            'rename', 'limit', 'close', 'hide',
            'user', 'speak', 'kick', 'reset',
            'owner', 'info'
        ];
        const result = buttonOrder.map(key => {
            const button = config.buttons[key];
            return button
                ? i18n_1.i18n.t("builders.message_embeds.settings.description.message_row", { dot: config.dot, emoji: button.emoji, title: button.title.toLowerCase() })
                : '';
        }).join('');
        return this.setTitle(i18n_1.i18n.t("builders.message_embeds.settings.title"))
            .setColor(config.color)
            .setDescription(i18n_1.i18n.t("builders.message_embeds.settings.description.head")
            + result).setImage(config?.line ? config.line : null);
    }
    infoRoom(member, config, channel, get) {
        const guildPerms = channel.permissionOverwrites.cache.get(member.guild.id);
        return this.setTitle(config.buttons.info.title)
            .setThumbnail(Utils_1.default.getAvatar(member))
            .setColor((0, config_1.getGuilds)().get(member.guild.id).color)
            .setDescription(i18n_1.i18n.t("builders.message_embeds.info.description.private_room", { voice_name: channel.toString() })
            + i18n_1.i18n.t(`builders.message_embeds.info.description.users.${channel.userLimit === 0 ? 'unlimited' : 'limited'}`, {
                amount: channel.members.size, limit: channel.userLimit
            })
            + i18n_1.i18n.t("builders.message_embeds.info.description.owner", { user_id: get.userId })
            + i18n_1.i18n.t("builders.message_embeds.info.description.creation_time", { creation_time: Math.round(get.created / 1000) })
            + i18n_1.i18n.t(`builders.message_embeds.info.description.visibility.${guildPerms && guildPerms.deny.has('ViewChannel') ? 'hidden' : 'visible'}`)
            + i18n_1.i18n.t(`builders.message_embeds.info.description.accessibility.${guildPerms && guildPerms.deny.has('Connect') ? 'locked' : 'unlocked'}`));
    }
    permissions(member, channel, page = 0) {
        const array = channel.permissionOverwrites.cache
            .filter(p => channel.guild.members.cache.has(p.id))
            .map(p => p);
        const max = Math.ceil(array.length / 5) === 0 ? 1 : Math.ceil(array.length / 5);
        const embed = this.setTitle(i18n_1.i18n.t("builders.message_embeds.permissions.title"))
            .setThumbnail(Utils_1.default.getAvatar(member))
            .setColor((0, config_1.getGuilds)().get(member.guild.id).color)
            .setFooter({ text: i18n_1.i18n.t("builders.message_embeds.permissions.page", { page: page + 1, total: max }) });
        for (let i = page * 5; (i < array.length && i < 5 * (page + 1)); i++) {
            const p = array[i];
            const target = member.guild.members.cache.get(p.id);
            if (target) {
                embed.addFields({
                    name: `${i + 1}. ${target.displayName}`,
                    value: (i18n_1.i18n.t(`builders.message_embeds.permissions.perms.connect.${p.deny.has('Connect') ? 'denied' : 'allowed'}`)
                        + i18n_1.i18n.t(`builders.message_embeds.permissions.perms.speak.${p.deny.has('Speak') ? 'denied' : 'allowed'}`))
                });
            }
        }
        return embed.setDescription((embed.data.fields || [])?.length === 0 ? i18n_1.i18n.t("builders.message_embeds.permissions.empty") : null);
    }
}
exports.default = EmbedBuilder;
