"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmbedBuilder_1 = __importDefault(require("../../strcut/utils/EmbedBuilder"));
const Interaction_1 = __importDefault(require("../../strcut/base/Interaction"));
const i18n_1 = require("../../i18n");
exports.default = new Interaction_1.default('rename', async (client, modal, config, res) => {
    await modal.deferReply({ ephemeral: true });
    const name = modal.fields.getTextInputValue('name');
    const voice = modal.member.voice.channel;
    if (res) {
        if (res.cooldown > Date.now()) {
            return modal.editReply({
                embeds: [new EmbedBuilder_1.default().default(modal.member, config.buttons[modal.customId].title, i18n_1.i18n.t("modals.rename.cooldown", { voice_name: voice.toString(), cooldown: Math.round(res.cooldown / 1000) }))]
            });
        }
        res.name = name;
        res.cooldown = Date.now() + (60 * 2.5 * 1000);
        await client.db.rooms.save(res);
    }
    await voice.setName(name);
    return modal.editReply({
        embeds: [new EmbedBuilder_1.default().default(modal.member, config.buttons[modal.customId].title, i18n_1.i18n.t("modals.rename.success", { voice_name: voice.toString() }))]
    });
});
