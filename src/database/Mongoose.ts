import mongoose from 'mongoose'
import Client from '../strcut/Client'
import RoomManager from './room/RoomManager'
import { i18n } from '../i18n'

export default class Mongoose {
    readonly rooms: RoomManager = new RoomManager()

    constructor(
        private readonly client: Client
    ) {}

    async connect() {
        mongoose.set('strictQuery', true);
        await mongoose.connect(
            this.client.config.internal.mongoURL,
            {
                autoIndex: true,
                autoCreate: true
            }
        )
        .then(async () => {
            await this.init()
            this.client.logger.login(i18n.t("logs.mongodb_connected"))
        })
        .catch((err: Error) => console.log(err));
    }

    async init() {
        await this.rooms.init()
    }
}