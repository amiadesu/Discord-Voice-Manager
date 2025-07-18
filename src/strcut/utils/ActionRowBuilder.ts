import { ActionRowBuilder as DJSActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, UserSelectMenuBuilder, VoiceChannel } from 'discord.js';
import { i18n } from '../../i18n';

export default class ActionRowBuilder {
    menuUser(customId: string, placeholder?: string, disabled?: boolean) {
        return [
            new DJSActionRowBuilder<UserSelectMenuBuilder>()
            .addComponents(
                new UserSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder || i18n.t("builders.action_row.select_user"))
                .setDisabled(Boolean(disabled))
            )
        ]
    }

    menuChannel(customId: string, placeholder?: string, disabled?: boolean) {
        return new DJSActionRowBuilder<ChannelSelectMenuBuilder>()
        .addComponents(
            new ChannelSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder(placeholder || i18n.t("builders.action_row.select_channel"))
            .setDisabled(Boolean(disabled))
        )
    }

    buttonRoom(disabled?: boolean) {
        return new DJSActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId('voiceChannel')
            .setLabel(i18n.t("builders.action_row.select_current_voice_channel"))
            .setDisabled(Boolean(disabled))
        )  
    }

    checkMembersPermission(id: string) {
        return [
            new DJSActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`checkMembersPermission.${id}`)
                .setLabel(i18n.t("builders.action_row.view_users_perms"))
            )  
        ]
    }

    pages(channel: VoiceChannel, page: number = 0) {        
        const array = channel.permissionOverwrites.cache
        .filter(p => channel.guild.members.cache.has(p.id))
        .map(p => p)

        const row1 = new DJSActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`back.${channel.id}`).setLabel(i18n.t("builders.action_row.back")),
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`forward.${channel.id}`).setLabel(i18n.t("builders.action_row.forward"))
        )

        const row2 = new DJSActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(`leave.${channel.id}`).setLabel(i18n.t("builders.action_row.return"))
        )

        const max = Math.ceil(array.length/5) === 0 ? 1 : Math.ceil(array.length/5)

        if((page+1) >= max || max === 1) {
            row1.components[1].setDisabled(true)
        } else {
            row1.components[1].setDisabled(false)
        }

        if(1 > page) {
            row1.components[0].setDisabled(true)
        } else {
            row1.components[0].setDisabled(false)
        }

        return [
            row1, row2
        ]
    }
}