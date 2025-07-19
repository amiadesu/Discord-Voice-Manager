"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoomManager_1 = __importDefault(require("./room/RoomManager"));
const i18n_1 = require("../i18n");
class Mongoose {
    constructor(client) {
        this.client = client;
        this.rooms = new RoomManager_1.default();
    }
    async connect() {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(this.client.config.internal.mongoURL, {
            autoIndex: true,
            autoCreate: true
        })
            .then(async () => {
            await this.init();
            this.client.logger.login(i18n_1.i18n.t("logs.mongodb_connected"));
        })
            .catch((err) => console.log(err));
    }
    async init() {
        await this.rooms.init();
    }
}
exports.default = Mongoose;
