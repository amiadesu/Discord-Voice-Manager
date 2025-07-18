import { EmbedBuilder as DJSEmbedBuilder, GuildMember, VoiceChannel } from 'discord.js';
import { getGuilds } from '../../config';
import { TRoom } from '../../database/room/Room';
import GuildConfig from '../../types/GuildConfig';
import Utils from './Utils';
import { i18n } from '../../i18n';

export default class EmbedBuilder extends DJSEmbedBuilder {
    default(member: GuildMember, title: string, description: string) {
        return this.setTitle(title).setColor(getGuilds().get(member.guild.id)!.color)
        .setDescription(`${member.toString()}, ${description}`)
        .setThumbnail(Utils.getAvatar(member))
    }

    settingRoomEmbed(config: GuildConfig) {
        const buttonOrder = [
            'rename', 'limit', 'close', 'hide',
            'user', 'speak', 'kick', 'reset',
            'owner', 'info'
        ];
        
        const result = buttonOrder.map(key => {
            const button = config.buttons[key];
            return button
                ? i18n.t("builders.message_embeds.settings.description.message_row", { dot: config.dot, emoji: button.emoji, title: button.title.toLowerCase() })
                : '';
        }).join('');

        return this.setTitle(i18n.t("builders.message_embeds.settings.title"))
        .setColor(config.color)
        .setDescription(
            i18n.t("builders.message_embeds.settings.description.head")
            + result
        ).setImage(config?.line ? config.line : null)
    }

    infoRoom(member: GuildMember, config: GuildConfig, channel: VoiceChannel, get: TRoom) {
        const guildPerms = channel.permissionOverwrites.cache.get(member.guild.id)

        return this.setTitle(config.buttons.info.title)
        .setThumbnail(Utils.getAvatar(member))
        .setColor(getGuilds().get(member.guild.id)!.color)
        .setDescription(
            i18n.t("builders.message_embeds.info.description.private_room", { voice_name: channel.toString() })
            + i18n.t(`builders.message_embeds.info.description.users.${channel.userLimit === 0 ? 'unlimited' : 'limited'}`, {
                amount: channel.members.size, limit: channel.userLimit
            })
            + i18n.t("builders.message_embeds.info.description.owner", { user_id: get.userId })
            + i18n.t("builders.message_embeds.info.description.creation_time", { creation_time: Math.round(get.created/1000) })
            + i18n.t(`builders.message_embeds.info.description.visibility.${guildPerms && guildPerms.deny.has('ViewChannel') ? 'hidden' : 'visible'}`)
            + i18n.t(`builders.message_embeds.info.description.accessibility.${guildPerms && guildPerms.deny.has('Connect') ? 'locked' : 'unlocked'}`)
        )
    }

    permissions(member: GuildMember, channel: VoiceChannel, page: number = 0) {
        const array = channel.permissionOverwrites.cache
        .filter(p => channel.guild.members.cache.has(p.id))
        .map(p => p)

        const max = Math.ceil(array.length/5) === 0 ? 1 : Math.ceil(array.length/5)

        const embed = this.setTitle(i18n.t("builders.message_embeds.permissions.title"))
        .setThumbnail(Utils.getAvatar(member))
        .setColor(getGuilds().get(member.guild.id)!.color)
        .setFooter(
            { text: i18n.t("builders.message_embeds.permissions.page", { page: page + 1, total: max }) }
        )

        for ( let i = page*5; (i < array.length && i < 5*(page+1)) ; i++ ) {
            const p = array[i]
            const target = member.guild.members.cache.get(p.id)
            if(target) {
                embed.addFields(
                    {
                        name: `${i+1}. ${target.displayName}`,
                        value: (
                            i18n.t(`builders.message_embeds.permissions.perms.connect.${p.deny.has('Connect') ? 'denied' : 'allowed'}`)
                            + i18n.t(`builders.message_embeds.permissions.perms.speak.${p.deny.has('Speak') ? 'denied' : 'allowed'}`)
                        )
                    }
                )
            }
        }

        return embed.setDescription((embed.data.fields || [] )?.length === 0 ? i18n.t("builders.message_embeds.permissions.empty") : null)
    }
}