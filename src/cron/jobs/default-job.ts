import { Client } from 'discord.js';

import { Job } from '../job.js';

export class DefaultJob extends Job {
    public name = 'Default Job';
    public schedule = '*/10 * * * * *';
    public log = true;
    public runOnce = false;
    public initialDelaySecs = 0;

    constructor(public client: Client) {
        super();
    }

    public async execute(): Promise<void> {
        console.log('Hello World');
    }
}
