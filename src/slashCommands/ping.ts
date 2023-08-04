import {
    SlashCommandBuilder,
    // ChannelType,
    // TextChannel,
} from 'discord.js';

import { SlashCommand } from '../types/types.js';
import { getThemeColor } from '../utils/functions.js';

const command: SlashCommand = {
    command: new SlashCommandBuilder().setName('ping').setDescription("Shows the bot's ping"),
    execute: interaction => {
        (async () => {
            const st = Date.now();
            await interaction.deferReply();
            const time = Date.now() - st;
            await interaction.editReply({
                embeds: [
                    {
                        color: getThemeColor('variable'),
                        title: 'Ping!',
                        fields: [
                            {
                                name: 'Roundtrip latency',
                                value: `${time}ms`,
                            },
                            {
                                name: 'Websocket ping',
                                value: `${
                                    interaction.client.ws.ping === -1
                                        ? 'Unavailable.'
                                        : `${interaction.client.ws.ping}ms`
                                }`,
                            },
                        ],
                    },
                ],
            });
        })().catch(e => console.log(e));
    },
    cooldown: 10,
};

export default command;
