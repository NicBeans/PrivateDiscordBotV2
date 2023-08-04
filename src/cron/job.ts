export abstract class Job {
    abstract name: string;
    abstract log: boolean;
    abstract schedule: string;
    runOnce = false;
    initialDelaySecs = 0;
    abstract execute(): Promise<void>;
}
