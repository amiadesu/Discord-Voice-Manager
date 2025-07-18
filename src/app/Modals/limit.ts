import { VoiceChannel } from 'discord.js';
import EmbedBuilder from '../../strcut/utils/EmbedBuilder';
import Interaction from '../../strcut/base/Interaction';
import { i18n } from '../../i18n';

export default new Interaction(
    'limit',
    async (client, modal, config, res): Promise<any> => {
        await modal.deferReply({ephemeral: true})

        const count = Number(modal.fields.getTextInputValue('count'))

        if(0 > count || isNaN(count)) {
            return modal.editReply({
                embeds: [ new EmbedBuilder().default(
                    modal.member,
                    config.buttons[modal.customId]!.title,
                    i18n.t("modals.limit.slots_number_must_be_positive")
                ) ]
            })
        }

        if(res) {
            res.limit = count
            await client.db.rooms.save(res)
        }

        await (modal.member.voice.channel as VoiceChannel).setUserLimit(count)

        return modal.editReply({
            embeds: [ new EmbedBuilder().default(
                modal.member,
                config.buttons[modal.customId]!.title,
                i18n.t("modals.limit.slots_number_change_success", { voice_name: modal.member.voice.channel!.toString() })
            ) ]
        })
    }
)