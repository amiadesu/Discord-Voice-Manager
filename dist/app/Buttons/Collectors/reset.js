"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmbedBuilder_1 = __importDefault(require("../../../strcut/utils/EmbedBuilder"));
const i18n_1 = require("../../../i18n");
exports.default = async (button, menu, config) => {
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
            embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.cannot_reset.self"))],
            components: []
        });
    }
    const voice = menu.member.voice.channel;
    await voice.permissionOverwrites.delete(member.id);
    return button.editReply({
        embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.reset_success", { member_name: member.toString(), voice_name: voice.toString() }))],
        components: []
    });
};
