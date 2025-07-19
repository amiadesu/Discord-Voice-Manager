"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmbedBuilder_1 = __importDefault(require("../../../strcut/utils/EmbedBuilder"));
const i18n_1 = require("../../../i18n");
exports.default = async (client, button, menu, config) => {
    if (menu.users.size === 0) {
        return button.editReply({
            embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.user_not_selected"))],
            components: []
        });
    }
    const member = menu.members.first();
    if (!member) {
        return button.editReply({
            embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.user_not_found"))],
            components: []
        });
    }
    if (member.id === menu.member.id) {
        return button.editReply({
            embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.cannot_kick.self"))],
            components: []
        });
    }
    const voice = menu.member.voice.channel;
    if (voice.id !== member.voice?.channelId) {
        return button.editReply({
            embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.user_not_in_voice", { member_name: member.toString(), voice_name: voice.toString() }))],
            components: []
        });
    }
    client.util.disconnectMember(member);
    return button.editReply({
        embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.kick_success", { member_name: member.toString(), voice_name: voice.toString() }))],
        components: []
    });
};
