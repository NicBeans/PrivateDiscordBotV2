import { Guild } from 'discord.js';

import GuildModel from '../schemas/Guild.js';
import { BotEvent } from '../types/types.js';

const event: BotEvent = {
    name: 'guildCreate',
    execute: (guild: Guild) => {
        (async () => {
            const newGuild = new GuildModel({
                guildID: guild.id,
                options: {},
                joinedAt: Date.now(),
            });
            await newGuild.save();
        })().catch(console.error);
    },
};

export default event;
