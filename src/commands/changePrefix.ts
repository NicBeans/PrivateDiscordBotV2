import { Command, GuildOption } from '../types/types.js';
import { setGuildOption } from '../utils/functions.js';

const command: Command = {
    name: 'changePrefix',
    execute: (message, args) => {
        (async () => {
            const prefix = args[1] as GuildOption;
            if (!prefix) return await message.channel.send('No prefix provided');
            if (!message.guild) return;
            await setGuildOption(message.guild, 'prefix', prefix);
            await message.channel.send('Prefix successfully changed!');
        })().catch(console.error);
    },
    permissions: ['Administrator'],
    aliases: [],
};

export default command;
