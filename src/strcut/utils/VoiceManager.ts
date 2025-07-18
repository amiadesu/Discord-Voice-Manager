import { ChannelType, OverwriteType, PermissionFlagsBits, VoiceState } from 'discord.js';
import Client from '../Client';
import { i18n } from '../../i18n';

export default class VoiceManager {
    private static readonly permissionsRoomOwner = {
        allow: [
            PermissionFlagsBits.Speak,
            PermissionFlagsBits.Stream,
            PermissionFlagsBits.UseVAD,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.PrioritySpeaker,
            PermissionFlagsBits.MuteMembers,
            PermissionFlagsBits.DeafenMembers,
            PermissionFlagsBits.MoveMembers,
            PermissionFlagsBits.ManageEvents,
            PermissionFlagsBits.CreateInstantInvite,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.SendTTSMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.UseApplicationCommands,
            PermissionFlagsBits.UseEmbeddedActivities,
            PermissionFlagsBits.RequestToSpeak,
            PermissionFlagsBits.UseSoundboard,
            PermissionFlagsBits.UseExternalSounds
        ],
        deny: [
            PermissionFlagsBits.ManageChannels,
            PermissionFlagsBits.ManageRoles,
            PermissionFlagsBits.ManageWebhooks,
            PermissionFlagsBits.MentionEveryone
        ]
    };

    static async onRoomJoin(client: Client, newState: VoiceState) {
        const { member, channel, guild } = newState
        if(!member || !guild || !channel) return
        const config = client.guildsConfig.get(guild.id)
        if(!config) return

        if (channel.id === config.channels.voice) {
            if(member.user.bot) {
                return member.voice.disconnect().catch(() => {})
            }

            const room = await client.db.rooms.findUser(guild.id, member.id)
            if(room.channelId !== '0' && guild.channels.cache.get(room.channelId)) {
                return member.voice.setChannel(room.channelId)
                .catch(async () => {
                    await member.voice.disconnect().catch(() => {})
                })
            }
            
            if(room.leave > Date.now()) {
                return member.voice.disconnect().catch(() => {})
            }

            const name = client.util.resolveChannelName(config, member)

            guild.channels.create(
                {
                    name: room.name === '0' ? name : room.name,
                    userLimit: room.limit,
                    type: ChannelType.GuildVoice,
                    parent: config.channels.category,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: VoiceManager.permissionsRoomOwner.allow,
                            deny: VoiceManager.permissionsRoomOwner.deny,
                            type: OverwriteType.Member
                        }
                    ],
                    reason: i18n.t("messages.private_room_creation")
                }
            ).then(async channel => {
                return member?.voice?.setChannel(channel.id).then(async () => {
                    room.channelId = channel.id
                    room.name = channel.name
                    await client.db.rooms.save(room)
                }).catch(async () => await channel.delete(i18n.t("messages.ddos_protection")).catch(() => {}))
            })
        }
    }

    static async onRoomLeave(client: Client, oldState: VoiceState) {
        const { member, channel, guild } = oldState
        if(!member || !guild || !channel) return
        const config = client.guildsConfig.get(guild.id)
        if(!config) return

        const room = await client.db.rooms.findChannel(channel.id)
        if(!channel?.parent || channel.id === config.channels.voice) return
        if(channel.parent.id !== config.channels.category) return

        if(channel.members.size === 0) {
            if(channel.parent.id === config.channels.category) await channel.delete(i18n.t("messages.last_user_disconnected")).catch(() => {})
        }

        if(room && room?.userId === member.id) {
            room.leave = Math.round(Date.now() + client.config.cooldownVoiceJoin)
            await client.db.rooms.save(room)
        }
    }
}