import { Client } from 'discord.js';
import { readdirSync } from 'node:fs';
import path, { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BotEvent, BotModule } from '../types/types.js';
import { color } from '../utils/functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client: Client): Promise<void> => {
    const eventsDir = join(__dirname, '../events');
    await Promise.all(
        readdirSync(eventsDir).map(async file => {
            if (!file.endsWith('.js')) return;
            const event: BotEvent = ((await import(`${eventsDir}/${file}`)) as BotModule).default;
            event.once
                ? client.once(event.name, (...args) =>
                      event.execute(
                          ...(args as (string | number | boolean | symbol | undefined)[]),
                      ),
                  )
                : client.on(event.name, (...args) =>
                      event.execute(
                          ...(args as (string | number | boolean | symbol | undefined)[]),
                      ),
                  );
            console.log(
                color('text', `🌠 Successfully loaded event ${color('variable', event.name)}`),
            );
        }),
    );
};
