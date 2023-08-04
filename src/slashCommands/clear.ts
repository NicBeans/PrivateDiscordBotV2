import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { SlashCommand } from '../types/types.js';

const ClearCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delets messages from the current channel.')
        .addIntegerOption(option => {
            return option
                .setMaxValue(100)
                .setMinValue(1)
                .setName('messagecount')
                .setDescription('Message amount to be cleared');
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: interaction => {
        (async () => {
            const messageCount = Number(interaction.options.get('messagecount')?.value);
            if (interaction.channel?.type === ChannelType.DM) return;
            const deletedMessages = await interaction.channel?.bulkDelete(messageCount, true);
            if (deletedMessages?.size === 0) void interaction.reply('No messages were deleted.');
            else void interaction.reply(`Successfully deleted ${deletedMessages?.size} message(s)`);
            setTimeout(() => {
                interaction.deleteReply().catch(console.error);
            }, 5000);
        })().catch(console.error);
    },
    cooldown: 10,
};

export default ClearCommand;
