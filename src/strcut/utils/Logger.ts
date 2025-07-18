import colors from 'colors';
import { i18n } from '../../i18n';

export default class Logger {
    log(text: any) {
        console.log(colors.yellow(i18n.t("logs.log")) + text)
    }

    login(text: string) {
        console.log(colors.green(i18n.t("logs.connected")) + text)
    }

    error(text: string | Error) {
        if(text instanceof Error) {
            console.log(
                colors.red(i18n.t("logs.error")) + text.name + text.message + '\n'
                + (
                    !text?.stack ? ''
                    : text.stack.split('\n').map(str => `> ${str}`).join('\n')
                )
            )
        } else {
            console.log(colors.red(i18n.t("logs.error")) + text)
        }
    }
}