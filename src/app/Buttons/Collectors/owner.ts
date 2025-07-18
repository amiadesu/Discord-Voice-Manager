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

    if(member.user.bot) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[menu.customId]!.title,
                i18n.t("messages.cannot_transfer_to.bot", { voice_name : menu.member.voice.channel!.toString() })
            ) ],
            components: []
        })
    }

    if(member.id === menu.member.id) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[menu.customId]!.title,
                i18n.t("messages.cannot_transfer_to.self", { voice_name : menu.member.voice.channel!.toString() })
            ) ],
            components: []
        })
    }

    const voice = menu.member.voice.channel!
    if(voice.id !== member.voice?.channelId) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[menu.customId]!.title,
                i18n.t("messages.user_not_in_voice", { member_name: member.toString(), voice_name: voice.toString() })
            ) ],
            components: []
        })
    }

    await voice.permissionOverwrites.delete(menu.user.id)
    await voice.permissionOverwrites.create(
        member.id,
        {
            Speak: true, Stream: true, UseVAD: true, Connect: true, ViewChannel: true, PrioritySpeaker: true, CreateInstantInvite: true,
            MoveMembers: false, ManageRoles: false, ManageWebhooks: false, ManageChannels: false
        }
    )

    const room = await client.db.rooms.findChannel(voice.id)
    if(room) {
        const res = await client.db.rooms.findUser(menu.guildId, member.id)
        res.channelId = voice.id
        await client.db.rooms.remove(room)
        await client.db.rooms.save(res)
    }

    return button.editReply({
        embeds: [ new EmbedBuilder().default(
            menu.member,
            config.buttons[menu.customId]!.title,
            i18n.t("messages.transfer_success", { member_name: member.toString(), voice_name: voice.toString() })
        ) ],
        components: []
    })
}