import { ButtonInteraction, ChannelType } from 'discord.js';
import ActionRowBuilder from '../../../../strcut/utils/ActionRowBuilder';
import EmbedBuilder from '../../../../strcut/utils/EmbedBuilder';
import IGuildConfig from '../../../../types/GuildConfig';
import Client from '../../../../strcut/Client';
import { i18n } from '../../../../i18n';

export default async (client: Client, button: ButtonInteraction<'cached'>, btn: ButtonInteraction<'cached'>, config: IGuildConfig) => {
    const channel = btn.guild.channels.cache.get(btn.customId.split('.')[1])

    if(!channel || channel.type !== ChannelType.GuildVoice) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                btn.member,
                i18n.t("into.user_perms_title"),
                i18n.t("info.not_exists_anymore")
            ) ],
            components: []
        })
    }

    const footer = btn.message.embeds[0]?.footer?.text
    const get = await client.db.rooms.findChannel(channel.id)
    if(!get || !footer) {
        return button.editReply({
            embeds: [ new EmbedBuilder().default(
                btn.member,
                i18n.t("into.user_perms_title"),
                i18n.t("info.not_exists_anymore")
            ) ],
            components: []
        })
    }

    const page = Number(footer.split('/')[0].split(': ')[1])-2

    return button.editReply({
        embeds: [ new EmbedBuilder().permissions(
            button.member,
            channel,
            page
        ) ],
        components: new ActionRowBuilder().pages(channel, page)
    })
}