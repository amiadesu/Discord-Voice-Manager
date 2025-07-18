import { VoiceChannel, TextChannel, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import EmbedBuilder from '../../strcut/utils/EmbedBuilder';
import Event from '../../strcut/base/Event';
import Client from '../../strcut/Client';
import { i18n } from '../../i18n';

export default new Event(
    {
        name: 'ready',
        once: true
    },
    async (client: Client) => {
        client.logger.login(i18n.t("logs.bot_connected", { bot: client.user!.tag }))

        client.guildsConfig.forEach(
            async (config, guildId) => {
                const guild = client.guilds.cache.get(guildId)
                if(!guild) return client.logger.error(i18n.t("logs.no_guild_with_id"))

                const voice = guild.channels.cache.get(config.channels.voice) as VoiceChannel
                if(!voice) return client.logger.error(i18n.t("logs.no_voice_channel_with_id", { guild_name: guild.name, guild_id: guild.id }))

                voice.members.map(async (member) => {
                    await member.voice.disconnect('Auto Voice Mod').catch(() => {})
                })

                const text = guild.channels.cache.get(config.channels.text) as TextChannel
                if(!text) return client.logger.error(i18n.t("logs.no_text_channel_with_id", { guild_name: guild.name, guild_id: guild.id }))

                text.messages.fetch().then((messages) => {
                    const fetch = messages.find((m) => m.id === config.message)

                    if(!fetch) {
                        return text.send({embeds: [new EmbedBuilder().setTitle(i18n.t("messages.copy_message_id"))]})
                    }

                    if(fetch.editable) {
                        const row1 = new ActionRowBuilder<ButtonBuilder>()
                        const row2 = new ActionRowBuilder<ButtonBuilder>()
                        
                        for ( let i = 0; Object.keys(config.buttons).length > i; i++ ) {
                            if(1 >= (i+1) / 5) {
                                row1.addComponents(
                                    new ButtonBuilder().setCustomId(Object.keys(config.buttons)[i]).setEmoji(Object.values(config.buttons)[i].emoji).setStyle(config.style)
                                )
                            } else {
                                row2.addComponents(
                                    new ButtonBuilder().setCustomId(Object.keys(config.buttons)[i]).setEmoji(Object.values(config.buttons)[i].emoji).setStyle(config.style)
                                )
                            }
                        }

                        fetch.edit({
                            embeds: [
                                new EmbedBuilder().settingRoomEmbed(config)
                            ],
                            components: [
                                row1,
                                row2
                            ]
                        })
                    }
                })
            }
        )
    }
)