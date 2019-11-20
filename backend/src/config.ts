import * as fs from "fs";
import { MongoMemoryServer } from 'mongodb-memory-server';

export namespace Config {

    export const HOPPER_VERSION = "0.2";
    export const HOPPER_VERSION_TYPE = "dev";

    export function parseConfig(file: string) {
        instance = new ConfigHolder(JSON.parse(fs.readFileSync(file).toString()));
    }

    export async function generateConfig() {
        const mongod = new MongoMemoryServer({ instance: { auth: false } });
        await mongod.getConnectionString(); // necessary to await start of db
        const info = mongod.getInstanceInfo();
        if (!info)
            throw new Error("Could not initalize mongodb memory server");
        const data = {
            dbHost: info.ip,
            dbPassword: "",
            dbUser: "",
            dbName: info.dbName,
            dbPort: info.port,
            startBackend: true
        }
        instance = new ConfigHolder(data)
    }

    class ConfigHolder {
        readonly dbHost: string;
        readonly dbUser: string;
        readonly dbPassword: string;
        readonly dbName: string;
        readonly dbPort: number;
        readonly startBackend: boolean;
        readonly port: number;

        constructor(data: any) {
            this.dbHost = data.dbHost;
            this.dbPassword = data.dbPassword;
            this.dbUser = data.dbUser;
            this.dbName = data.dbName;
            this.dbPort = data.dbPort || 27017;
            this.startBackend = data.startBackend;
            this.port = data.port || 80;

            if (this.dbHost == undefined || this.dbUser == undefined || this.dbPassword == undefined || this.dbName == undefined) {
                throw new Error("Config incomplete!");
            }
        }
    }

    export let instance: ConfigHolder;
}
