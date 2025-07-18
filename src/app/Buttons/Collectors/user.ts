import { ButtonInteraction, UserSelectMenuInteraction } from 'discord.js';
import EmbedBuilder from '../../../strcut/utils/EmbedBuilder';
import IGuildConfig from '../../../types/GuildConfig';
import Client from '../../../strcut/Client';
import { i18n } from '../../../i18n';

export default async (client: Client, button: ButtonInteraction<'cached'>, menu: UserSelectMenuInteraction<'cached'>, config: IGuildConfig) => {
    if(menu.users.size === 0) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[menu.customId]!.title,
                i18n.t("messages.user_not_selected")
            ) ],
            components: []
        })
    }

    const member = menu.members.first()

    if(!member) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[menu.customId]!.title,
                i18n.t("messages.user_not_found")
            ) ],
            components: []
        })
    }

    if(member.id === menu.member.id) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[menu.customId]!.title,
                i18n.t("messages.cannot_change_access_perms.self")
            ) ],
            components: []
        })
    }

    const voice = menu.member.voice.channel!
    const closed = voice.permissionOverwrites.cache.get(member.id)
    let state: boolean

    if(closed && closed.deny.has('Connect')) {
        client.util.disconnectMember(member, voice.id)
        await voice.permissionOverwrites.edit(member.id, {Connect: true})
        state = true
    } else {
        client.util.disconnectMember(member, voice.id)
        await voice.permissionOverwrites.edit(member.id, {Connect: false})
        state = false
    }

    return button.editReply({
        embeds: [ new EmbedBuilder().default(
            menu.member,
            config.buttons[menu.customId]!.title,
            i18n.t(`messages.access_perms_change_success.${state ? 'allow' : 'deny'}`, { member_name: member.toString(), voice_name: voice.toString() })
        ) ],
        components: []
    })
}