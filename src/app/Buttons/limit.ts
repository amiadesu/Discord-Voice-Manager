import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import Interaction from '../../strcut/base/Interaction';
import IGuildConfig from '../../types/GuildConfig';
import Client from '../../strcut/Client';
import { i18n } from '../../i18n';

export default new Interaction(
    'limit',
    async (client: Client, button: ButtonInteraction<'cached'>, config: IGuildConfig) => {
        return button.showModal(
            new ModalBuilder()
            .setTitle(config.buttons[button.customId]!.title)
            .setCustomId('limit')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setStyle(TextInputStyle.Short)
                    .setCustomId('count')
                    .setLabel(i18n.t("modals.info.label"))
                    .setPlaceholder(i18n.t("modals.info.placeholder"))
                    .setValue(String(button.member.voice.channel!.userLimit))
                    .setMaxLength(2)
                    .setMinLength(1)
                    .setRequired(true)
                )
            )
        )
    }
)