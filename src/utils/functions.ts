import chalk from 'chalk';
import {
    Guild,
    GuildMember,
    PermissionFlagsBits,
    PermissionResolvable,
    TextChannel,
} from 'discord.js';
import mongoose from 'mongoose';

import GuildDB from '../schemas/Guild.js';
import { GuildOption } from '../types/types.js';

type colorType = 'text' | 'variable' | 'error';

const themeColors = {
    text: '#ff8e4d',
    variable: '#ff624d',
    error: '#f5426c',
};

export const getThemeColor = (color: colorType): number =>
    Number(`0x${themeColors[color].substring(1)}`);

export const color = (col: colorType, message: unknown): string => {
    return chalk.hex(themeColors[col])(message);
};

export const checkPermissions = (
    member: GuildMember,
    permissions: Array<PermissionResolvable>,
): Array<string | undefined> => {
    const neededPermissions: PermissionResolvable[] = [];
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission);
    });
    if (neededPermissions.length === 0) return [];
    return neededPermissions.map(p => {
        if (typeof p === 'string') {
            return p.split(/(?=[A-Z])/).join(' ');
        } else {
            return Object.keys(PermissionFlagsBits)
                .find(k => (Object(PermissionFlagsBits) as { [key: string]: bigint })[k] === p)
                ?.split(/(?=[A-Z])/)
                .join(' ');
        }
    });
};

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number): void => {
    channel
        .send(message)
        .then(m =>
            setTimeout(() => {
                (async () => {
                    await (await channel.messages.fetch(m)).delete();
                })().catch(console.error);
            }, duration),
        )
        .catch(console.error);
    return;
};

export const getGuildOption = async (guild: Guild, option: GuildOption): Promise<string | null> => {
    if (mongoose.connection.readyState === mongoose.ConnectionStates.disconnected) {
        throw new Error('Database not connected.');
    }
    const foundGuild = await GuildDB.findOne({ guildID: guild.id });
    if (!foundGuild) return null;
    return foundGuild.options[option];
};

export const setGuildOption = async (
    guild: Guild,
    option: GuildOption,
    value: GuildOption,
): Promise<void> => {
    if (mongoose.connection.readyState === mongoose.ConnectionStates.disconnected) {
        throw new Error('Database not connected.');
    }
    const foundGuild = await GuildDB.findOne({ guildID: guild.id });
    if (!foundGuild) return;
    foundGuild.options[option] = value;
    await foundGuild.save();
};
