"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("./strcut/Client"));
const i18n_1 = require("./i18n");
async function main() {
    console.clear();
    await (0, i18n_1.initI18n)();
    new Client_1.default().start();
}
main();
