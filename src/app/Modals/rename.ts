import { VoiceChannel } from 'discord.js';
import EmbedBuilder from '../../strcut/utils/EmbedBuilder';
import Interaction from '../../strcut/base/Interaction';
import { i18n } from '../../i18n';

export default new Interaction(
    'rename',
    async (client, modal, config, res): Promise<any> => {
        await modal.deferReply({ephemeral: true})

        const name = modal.fields.getTextInputValue('name')

        const voice = modal.member.voice.channel as VoiceChannel

        if(res) {
            if(res.cooldown > Date.now()) {
                return modal.editReply({
                    embeds: [ new EmbedBuilder().default(
                        modal.member,
                        config.buttons[modal.customId]!.title,
                        i18n.t("modals.rename.cooldown", { voice_name: voice.toString(), cooldown: Math.round(res.cooldown/1000) })
                    ) ]
                })
            }

            res.name = name
            res.cooldown = Date.now() + (60*2.5*1000)
            await client.db.rooms.save(res)
        }

        await voice.setName(name)

        return modal.editReply({
            embeds: [ new EmbedBuilder().default(
                modal.member,
                config.buttons[modal.customId]!.title,
                i18n.t("modals.rename.success", { voice_name: voice.toString() })
            ) ]
        })
    }
)
