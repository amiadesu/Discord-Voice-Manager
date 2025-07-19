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
    if (member.user.bot) {
        return button.editReply({
            embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.cannot_transfer_to.bot", { voice_name: menu.member.voice.channel.toString() }))],
            components: []
        });
    }
    if (member.id === menu.member.id) {
        return button.editReply({
            embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.cannot_transfer_to.self", { voice_name: menu.member.voice.channel.toString() }))],
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
    await voice.permissionOverwrites.delete(menu.user.id);
    await voice.permissionOverwrites.create(member.id, {
        Speak: true, Stream: true, UseVAD: true, Connect: true, ViewChannel: true, PrioritySpeaker: true, CreateInstantInvite: true,
        MoveMembers: false, ManageRoles: false, ManageWebhooks: false, ManageChannels: false
    });
    const room = await client.db.rooms.findChannel(voice.id);
    if (room) {
        const res = await client.db.rooms.findUser(menu.guildId, member.id);
        res.channelId = voice.id;
        await client.db.rooms.remove(room);
        await client.db.rooms.save(res);
    }
    return button.editReply({
        embeds: [new EmbedBuilder_1.default().default(menu.member, config.buttons[menu.customId].title, i18n_1.i18n.t("messages.transfer_success", { member_name: member.toString(), voice_name: voice.toString() }))],
        components: []
    });
};
