"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const i18n_1 = require("../../i18n");
class Logger {
    log(text) {
        console.log(colors_1.default.yellow(i18n_1.i18n.t("logs.log")) + text);
    }
    login(text) {
        console.log(colors_1.default.green(i18n_1.i18n.t("logs.connected")) + text);
    }
    error(text) {
        if (text instanceof Error) {
            console.log(colors_1.default.red(i18n_1.i18n.t("logs.error")) + text.name + text.message + '\n'
                + (!text?.stack ? ''
                    : text.stack.split('\n').map(str => `> ${str}`).join('\n')));
        }
        else {
            console.log(colors_1.default.red(i18n_1.i18n.t("logs.error")) + text);
        }
    }
}
exports.default = Logger;
