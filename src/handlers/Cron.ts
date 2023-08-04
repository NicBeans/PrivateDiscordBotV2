import { Client } from 'discord.js';

import { CronMan } from '../cron/cron-man.js';
import { Job } from '../cron/job.js';
import { DefaultJob } from '../cron/jobs/default-job.js';

export default async (client: Client): Promise<void> => {
    const jobs: Job[] = [new DefaultJob(client)];

    new CronMan(client, jobs).start();
};
