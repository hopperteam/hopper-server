import * as fs from "fs";
import Log from './log';

const log = new Log("Config");

export namespace Config {

    export const HOPPER_VERSION = "1.0.0";
    export const HOPPER_VERSION_TYPE = "prod";

    export async function parseConfig(file: string) {
        var data: any = JSON.parse(fs.readFileSync(file).toString());
        if (data.useTestEnv) {
            log.warn("Using testing environment")
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

            data.jwtCertPath = file;
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
        readonly useTestEnv: boolean;
        readonly jwtCert: Buffer;
        readonly permissionNamespace: string;

        constructor(data: any) {
            this.dbHost = data.dbHost;
            this.dbPassword = data.dbPassword;
            this.dbUser = data.dbUser;
            this.dbName = data.dbName;
            this.dbPort = data.dbPort || 27017;
            this.port = data.port || 80;
            this.startMonitoring = data.startMonitoring || false;
            this.useTestEnv = data.useTestEnv || false;
            this.permissionNamespace = data.permissionNamespace || "Hopper";
            let  jwtCertPath = data.jwtCertPath;


            if (this.dbHost == undefined || this.dbUser == undefined || this.dbPassword == undefined || this.dbName == undefined || jwtCertPath == undefined) {
                throw new Error("Config incomplete!");
            }

            this.jwtCert = fs.readFileSync(jwtCertPath);


        }
    }

    export let instance: ConfigHolder;
}
