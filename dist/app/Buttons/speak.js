"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ActionRowBuilder_1 = __importDefault(require("../../strcut/utils/ActionRowBuilder"));
const EmbedBuilder_1 = __importDefault(require("../../strcut/utils/EmbedBuilder"));
const Interaction_1 = __importDefault(require("../../strcut/base/Interaction"));
const i18n_1 = require("../../i18n");
exports.default = new Interaction_1.default('speak', async (client, button, config) => {
    await button.deferReply({ ephemeral: true });
    const fetch = await button.fetchReply();
    await button.editReply({
        embeds: [
            new EmbedBuilder_1.default().default(button.member, config.buttons[button.customId].title, i18n_1.i18n.t("messages.no_user_to_change_speak_perms_specified", { voice_name: button.member.voice.channel.toString() }))
        ],
        components: new ActionRowBuilder_1.default().menuUser('speak', config.placeholder.user)
    });
    const collector = new discord_js_1.InteractionCollector(client, { time: 30000, message: fetch });
    collector.on('collect', async (interaction) => {
        await interaction.deferUpdate();
        collector.stop();
        return (await Promise.resolve().then(() => __importStar(require('./Collectors/speak')))).default(client, button, interaction, config);
    });
    collector.on('end', (collected, reasone) => {
        if (reasone === 'time') {
            return button.editReply({
                embeds: [
                    new EmbedBuilder_1.default().default(button.member, config.buttons[button.customId].title, i18n_1.i18n.t("messages.time_to_specify_user_has_expired"))
                ],
                components: new ActionRowBuilder_1.default().menuUser('speak', config.placeholder.user, true)
            });
        }
    });
});
