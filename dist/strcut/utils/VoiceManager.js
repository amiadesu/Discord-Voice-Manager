"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const i18n_1 = require("../../i18n");
class VoiceManager {
    static async onRoomJoin(client, newState) {
        const { member, channel, guild } = newState;
        if (!member || !guild || !channel)
            return;
        const config = client.guildsConfig.get(guild.id);
        if (!config)
            return;
        if (channel.id === config.channels.voice) {
            if (member.user.bot) {
                return member.voice.disconnect().catch(() => { });
            }
            const room = await client.db.rooms.findUser(guild.id, member.id);
            if (room.channelId !== '0' && guild.channels.cache.get(room.channelId)) {
                return member.voice.setChannel(room.channelId)
                    .catch(async () => {
                    await member.voice.disconnect().catch(() => { });
                });
            }
            if (room.leave > Date.now()) {
                return member.voice.disconnect().catch(() => { });
            }
            const name = client.util.resolveChannelName(config, member);
            guild.channels.create({
                name: room.name === '0' ? name : room.name,
                userLimit: room.limit,
                type: discord_js_1.ChannelType.GuildVoice,
                parent: config.channels.category,
                permissionOverwrites: [
                    {
                        id: member.id,
                        allow: VoiceManager.permissionsRoomOwner.allow,
                        deny: VoiceManager.permissionsRoomOwner.deny,
                        type: discord_js_1.OverwriteType.Member
                    }
                ],
                reason: i18n_1.i18n.t("messages.private_room_creation")
            }).then(async (channel) => {
                return member?.voice?.setChannel(channel.id).then(async () => {
                    room.channelId = channel.id;
                    room.name = channel.name;
                    await client.db.rooms.save(room);
                }).catch(async () => await channel.delete(i18n_1.i18n.t("messages.ddos_protection")).catch(() => { }));
            });
        }
    }
    static async onRoomLeave(client, oldState) {
        const { member, channel, guild } = oldState;
        if (!member || !guild || !channel)
            return;
        const config = client.guildsConfig.get(guild.id);
        if (!config)
            return;
        const room = await client.db.rooms.findChannel(channel.id);
        if (!channel?.parent || channel.id === config.channels.voice)
            return;
        if (channel.parent.id !== config.channels.category)
            return;
        if (channel.members.size === 0) {
            if (channel.parent.id === config.channels.category)
                await channel.delete(i18n_1.i18n.t("messages.last_user_disconnected")).catch(() => { });
        }
        if (room && room?.userId === member.id) {
            room.leave = Math.round(Date.now() + client.config.cooldownVoiceJoin);
            await client.db.rooms.save(room);
        }
    }
}
VoiceManager.permissionsRoomOwner = {
    allow: [
        discord_js_1.PermissionFlagsBits.Speak,
        discord_js_1.PermissionFlagsBits.Stream,
        discord_js_1.PermissionFlagsBits.UseVAD,
        discord_js_1.PermissionFlagsBits.Connect,
        discord_js_1.PermissionFlagsBits.ViewChannel,
        discord_js_1.PermissionFlagsBits.PrioritySpeaker,
        discord_js_1.PermissionFlagsBits.MuteMembers,
        discord_js_1.PermissionFlagsBits.DeafenMembers,
        discord_js_1.PermissionFlagsBits.MoveMembers,
        discord_js_1.PermissionFlagsBits.ManageEvents,
        discord_js_1.PermissionFlagsBits.CreateInstantInvite,
        discord_js_1.PermissionFlagsBits.SendMessages,
        discord_js_1.PermissionFlagsBits.SendTTSMessages,
        discord_js_1.PermissionFlagsBits.EmbedLinks,
        discord_js_1.PermissionFlagsBits.AttachFiles,
        discord_js_1.PermissionFlagsBits.ReadMessageHistory,
        discord_js_1.PermissionFlagsBits.UseApplicationCommands,
        discord_js_1.PermissionFlagsBits.UseEmbeddedActivities,
        discord_js_1.PermissionFlagsBits.RequestToSpeak,
        discord_js_1.PermissionFlagsBits.UseSoundboard,
        discord_js_1.PermissionFlagsBits.UseExternalSounds
    ],
    deny: [
        discord_js_1.PermissionFlagsBits.ManageChannels,
        discord_js_1.PermissionFlagsBits.ManageRoles,
        discord_js_1.PermissionFlagsBits.ManageWebhooks,
        discord_js_1.PermissionFlagsBits.MentionEveryone
    ]
};
exports.default = VoiceManager;
