import { REST } from '@discordjs/rest';
import { Client, Routes, SlashCommandBuilder } from 'discord.js';
import { readdirSync } from 'node:fs';
import path, { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Command, CommandModule, SlashCommand, SlashCommandModule } from '../types/types.js';
import { color } from '../utils/functions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client: Client): Promise<void> => {
    const slashCommands: SlashCommandBuilder[] = [];
    const commands: Command[] = [];

    const slashCommandsDir = join(__dirname, '../slashCommands');
    const commandsDir = join(__dirname, '../commands');

    await Promise.all(
        readdirSync(slashCommandsDir).map(async file => {
            if (!file.endsWith('.js')) return;
            const command: SlashCommand = (
                (await import(`${slashCommandsDir}/${file}`)) as SlashCommandModule
            ).default;
            slashCommands.push(command.command);
            client.slashCommands.set(command.command.name, command);
        }),
    );

    await Promise.all(
        readdirSync(commandsDir).map(async file => {
            if (!file.endsWith('.js')) return;
            const command: Command = ((await import(`${commandsDir}/${file}`)) as CommandModule)
                .default;
            commands.push(command);
            client.commands.set(command.name, command);
        }),
    );

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: slashCommands.map(command => command.toJSON()),
    })
        .then(data => {
            console.log(
                color(
                    'text',
                    `🔥 Successfully loaded ${color(
                        'variable',
                        (data as SlashCommandBuilder[]).length,
                    )} slash command(s)`,
                ),
            );
            console.log(
                color(
                    'text',
                    `🔥 Successfully loaded ${color('variable', commands.length)} command(s)`,
                ),
            );
        })
        .catch(e => {
            console.log(e);
        });
};
