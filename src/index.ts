import Client from './strcut/Client';
import { initI18n } from './i18n';

async function main() {
    console.clear();
    await initI18n();
    new Client().start();
}

main();