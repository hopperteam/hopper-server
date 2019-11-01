import * as fs from "fs";

export namespace Config {

    export const HOPPER_VERSION = "0.2";
    export const HOPPER_VERSION_TYPE = "dev";

    export function initConfig(file: string) {
        instance = new ConfigHolder(JSON.parse(fs.readFileSync(file).toString()));
    }

    class ConfigHolder {
        readonly dbHost: string;
        readonly dbUser: string;
        readonly dbPassword: string;
        readonly dbName: string;
        readonly startBackend: boolean;
        readonly port: string;

        constructor(data: any) {
            this.dbHost = data.dbHost;
            this.dbPassword = data.dbPassword;
            this.dbUser = data.dbUser;
            this.dbName = data.dbName;
            this.startBackend = data.startBackend;
            this.port = data.port || 80;

            if (this.dbHost == undefined || this.dbUser == undefined || this.dbPassword == undefined || this.dbName == undefined) {
                throw new Error("Config incomplete!");
            }
        }
    }

    export let instance: ConfigHolder;
}
