import * as fs from "fs";

export namespace Config {

    export const HOPPER_VERSION = "0.2";
    export const HOPPER_VERSION_TYPE = "dev";

    export async function parseConfig(file: string) {
        var data: any = JSON.parse(fs.readFileSync(file).toString());
        if (data.useMemoryDb) {
            const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
            const mongod = new MongoMemoryServer({ instance: { auth: false } });
            await mongod.getConnectionString(); // necessary to await start of db
            const info = mongod.getInstanceInfo();
            if (!info)
                throw new Error("Could not initalize mongodb memory server");
            data.dbHost = info.ip;
            data.dbPassword = "";
            data.dbUser = "";
            data.dbName = info.dbName;
            data.dbPort = info.port;
        }
        instance = new ConfigHolder(data);
    }

    class ConfigHolder {
        readonly dbHost: string;
        readonly dbUser: string;
        readonly dbPassword: string;
        readonly dbName: string;
        readonly dbPort: number;
        readonly port: number;
        readonly startMonitoring: boolean;
        readonly useMemoryDb: boolean;

        constructor(data: any) {
            this.dbHost = data.dbHost;
            this.dbPassword = data.dbPassword;
            this.dbUser = data.dbUser;
            this.dbName = data.dbName;
            this.dbPort = data.dbPort || 27017;
            this.port = data.port || 80;
            this.startMonitoring = data.startMonitoring || false;
            this.useMemoryDb = data.useMemoryDb || false;

            if (this.dbHost == undefined || this.dbUser == undefined || this.dbPassword == undefined || this.dbName == undefined) {
                throw new Error("Config incomplete!");
            }


        }
    }

    export let instance: ConfigHolder;
}
