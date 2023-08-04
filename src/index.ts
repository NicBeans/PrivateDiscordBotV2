import { Client, Collection, GatewayIntentBits } from 'discord.js';
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits;
const client = new Client({ intents: [Guilds, MessageContent, GuildMessages, GuildMembers] });
import { config } from 'dotenv';
import { readdirSync } from 'node:fs';
import path, { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// import { CronMan } from './cron/cron-man.js';
// import { Job } from './cron/job.js';
// import { DefaultJob } from './cron/jobs/default-job.js';
import { Command, SlashCommand } from './types/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, './handlers');
await Promise.all(
    readdirSync(handlersDir).map(async handler => {
        const handlerModule = (await import(`${handlersDir}/${handler}`)) as {
            default: (cLient: Client) => Promise<void>;
        };
        await handlerModule.default(client);
    }),
);

await client.login(process.env.TOKEN);
