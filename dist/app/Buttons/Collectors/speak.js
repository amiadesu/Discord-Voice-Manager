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
            embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.cannot_change_speak_perms.self"))],
            components: []
        });
    }
    const voice = menu.member.voice.channel;
    const closed = voice.permissionOverwrites.cache.get(member.id);
    let state;
    if (closed && closed.deny.has('Speak')) {
        client.util.disconnectMember(member, voice.id);
        await voice.permissionOverwrites.edit(member.id, { Speak: true });
        state = true;
    }
    else {
        client.util.disconnectMember(member, voice.id);
        await voice.permissionOverwrites.edit(member.id, { Speak: false });
        state = false;
    }
    return button.editReply({
        embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t(`messages.speak_perms_change_success.${state ? 'allow' : 'deny'}`, { member_name: member.toString(), voice_name: voice.toString() }))],
        components: []
    });
};
