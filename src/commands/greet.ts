import { PermissionFlagsBits } from 'discord.js';

import { Command } from '../types/types.js';

const command: Command = {
    name: 'greet',
    execute: message => {
        (async () => {
            const toGreet = message.mentions.members?.first();
            await message.channel.send(
                `Hello there ${toGreet ? toGreet.user.username : message.member?.user.username}!`,
            );
        })().catch(console.error);
    },
    cooldown: 10,
    aliases: ['sayhello'],
    permissions: ['Administrator', PermissionFlagsBits.ManageEmojisAndStickers],
};

export default command;
