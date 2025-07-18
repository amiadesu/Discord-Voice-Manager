import { ButtonInteraction, InteractionCollector, Client as DJSClient, UserSelectMenuInteraction } from 'discord.js';
import ActionRowBuilder from '../../strcut/utils/ActionRowBuilder';
import EmbedBuilder from '../../strcut/utils/EmbedBuilder';
import Interaction from '../../strcut/base/Interaction';
import IGuildConfig from '../../types/GuildConfig';
import Client from '../../strcut/Client';
import { i18n } from '../../i18n';

export default new Interaction(
    'reset',
    async (client: Client, button: ButtonInteraction<'cached'> , config: IGuildConfig): Promise<any> => {
        await button.deferReply({ephemeral: true })

        const fetch = await button.fetchReply();

        await button.editReply({
            embeds: [
                new EmbedBuilder().default(
                    button.member,
                    config.buttons[button.customId]!.title,
                    i18n.t("messages.no_user_to_reset_specified", { voice_name: button.member.voice.channel!.toString() })
                )
            ],
            components: new ActionRowBuilder().menuUser('reset', config.placeholder.user)
        })

        const collector = new InteractionCollector(
            client as DJSClient<true>,
            { time: 30_000, message: fetch }
        )

        collector.on('collect', async (interaction: UserSelectMenuInteraction<'cached'>): Promise<any> => {
            await interaction.deferUpdate()
            collector.stop()
            return (await import('./Collectors/reset')).default(button, interaction, config)
        })

        collector.on('end', (collected, reasone: string): any => {
            if(reasone === 'time') {
                return button.editReply({
                    embeds: [
                        new EmbedBuilder().default(
                            button.member,
                            config.buttons[button.customId]!.title,
                            i18n.t("messages.time_to_specify_user_has_expired")
                        )
                    ],
                    components: new ActionRowBuilder().menuUser('reset', config.placeholder.user, true)
                })
            }
        })
    }
)