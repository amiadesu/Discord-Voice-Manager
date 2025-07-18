import { ButtonInteraction, ChannelSelectMenuInteraction, ChannelType } from 'discord.js';
import ActionRowBuilder from '../../../../strcut/utils/ActionRowBuilder';
import EmbedBuilder from '../../../../strcut/utils/EmbedBuilder';
import IGuildConfig from '../../../../types/GuildConfig';
import Client from '../../../../strcut/Client';
import { i18n } from '../../../../i18n';

export default async (client: Client, button: ButtonInteraction<'cached'>, menu: ChannelSelectMenuInteraction<'cached'>, config: IGuildConfig) => {
    if(menu.channels.size === 0) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[button.customId]!.title,
                i18n.t("info.channel_not_chosen")
            ) ],
            components: []
        })
    }

    const channel = menu.channels.first()

    const get = await client.db.rooms.findChannel(channel!.id)
    if(!channel || channel.type !== ChannelType.GuildVoice || !get) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                menu.member,
                config.buttons[button.customId]!.title,
                i18n.t("info.not_private_room")
            ) ],
            components: []
        })
    }

    return button.editReply({
        embeds: [ new EmbedBuilder().infoRoom(
            button.member,
            config,
            channel,
            get
        ) ],
        components: new ActionRowBuilder().checkMembersPermission(channel.id)
    })
}