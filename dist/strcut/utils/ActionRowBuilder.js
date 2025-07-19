"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const i18n_1 = require("../../i18n");
class ActionRowBuilder {
    menuUser(customId, placeholder, disabled) {
        return [
            new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.UserSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder || i18n_1.i18n.t("builders.action_row.select_user"))
                .setDisabled(Boolean(disabled)))
        ];
    }
    menuChannel(customId, placeholder, disabled) {
        return new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ChannelSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder(placeholder || i18n_1.i18n.t("builders.action_row.select_channel"))
            .setDisabled(Boolean(disabled)));
    }
    buttonRoom(disabled) {
        return new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setStyle(discord_js_1.ButtonStyle.Primary)
            .setCustomId('voiceChannel')
            .setLabel(i18n_1.i18n.t("builders.action_row.select_current_voice_channel"))
            .setDisabled(Boolean(disabled)));
    }
    checkMembersPermission(id) {
        return [
            new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setCustomId(`checkMembersPermission.${id}`)
                .setLabel(i18n_1.i18n.t("builders.action_row.view_users_perms")))
        ];
    }
    pages(channel, page = 0) {
        const array = channel.permissionOverwrites.cache
            .filter(p => channel.guild.members.cache.has(p.id))
            .map(p => p);
        const row1 = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder().setStyle(discord_js_1.ButtonStyle.Secondary).setCustomId(`back.${channel.id}`).setLabel(i18n_1.i18n.t("builders.action_row.back")), new discord_js_1.ButtonBuilder().setStyle(discord_js_1.ButtonStyle.Secondary).setCustomId(`forward.${channel.id}`).setLabel(i18n_1.i18n.t("builders.action_row.forward")));
        const row2 = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder().setStyle(discord_js_1.ButtonStyle.Primary).setCustomId(`leave.${channel.id}`).setLabel(i18n_1.i18n.t("builders.action_row.return")));
        const max = Math.ceil(array.length / 5) === 0 ? 1 : Math.ceil(array.length / 5);
        if ((page + 1) >= max || max === 1) {
            row1.components[1].setDisabled(true);
        }
        else {
            row1.components[1].setDisabled(false);
        }
        if (1 > page) {
            row1.components[0].setDisabled(true);
        }
        else {
            row1.components[0].setDisabled(false);
        }
        return [
            row1, row2
        ];
    }
}
exports.default = ActionRowBuilder;
