import { ButtonInteraction, GuildMember, Interaction, ModalSubmitInteraction } from 'discord.js';
import { ButtonRun, ModalRun } from '../../types/base/Interaction';
import EmbedBuilder from '../../strcut/utils/EmbedBuilder';
import Event from '../../strcut/base/Event';
import Client from '../../strcut/Client';
import { i18n } from '../../i18n';

export default new Event(
    {
        name: 'interactionCreate'
    },
    async (client: Client, interaction: Interaction): Promise<any> => {
        const member = interaction.member as GuildMember

        if(interaction.isButton()) {
            const config = client.guildsConfig.get(member.guild.id)
            if(!config) {
                return interaction.reply({ content: i18n.t("messages.no_guild_config"), ephemeral: true })
            }

            const get = client.util.getButton(interaction.customId)
            if(get) {
                const room = client.db.rooms.get(`${interaction.guildId}.${member.id}`)
                if(interaction.customId !== 'info' && (!member.voice?.channel || !room || room.channelId !== member.voice?.channelId)) {
                    return interaction.reply({
                        embeds: [ new EmbedBuilder().default(
                            member,
                            config!.buttons[interaction.customId]?.title || i18n.t("messages.unknown_interaction"),
                            i18n.t("messages.not_in_own_private_room")
                        ) ], ephemeral: true
                    })
                }

                return (get.run as ButtonRun)(client, interaction as ButtonInteraction<'cached'>, config)
            }
        }

        if(interaction.isModalSubmit()) {
            const config = client.guildsConfig.get(interaction.guild!.id)
            if(!config) {
                return interaction.reply({ content: i18n.t("messages.no_guild_config"), ephemeral: true })
            }

            const get = client.util.getModal(interaction.customId)
            if(get) {
                const room = client.db.rooms.get(`${interaction.guildId}.${member.id}`)
                if(!member.voice?.channel || !room || room.channelId !== member.voice?.channelId) {
                    return interaction.reply({
                        embeds: [ new EmbedBuilder().default(
                            member,
                            config!.buttons[interaction.customId]?.title || i18n.t("messages.unknown_interaction"),
                            i18n.t("messages.not_in_own_private_room")
                        ) ], ephemeral: true
                    })
                }

                return (get.run as ModalRun)(client, interaction as ModalSubmitInteraction<'cached'>, config, room)
            } else {
                if(!interaction.replied && !interaction.deferred) {
                    return interaction.reply({ content: i18n.t("messages.unknown_interaction"), ephemeral: true })
                }
            }
        }
    }
)