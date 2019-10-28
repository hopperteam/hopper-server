import {App} from "./notification";
import {Notification} from "./notification";

const LOADING_TIME = 200;

export default class HopperApi {
    static async login(username: string, password: string): Promise<HopperApi|null> {
        return new Promise<HopperApi|null>((resolve) => {
            console.log("## DUMMY API ##: login(" + username + ", " + password + ")");
            setTimeout(() => {
                if (username == "max" && password == "1234") {
                    resolve(new HopperApi("34n22"));
                } else {
                    resolve(null);
                }
            }, LOADING_TIME);
        });
    }

    public async getApps(): Promise<App[]> {
        return new Promise<App[]>(resolve => {
            console.log("## DUMMY API ##: getApps()");
            resolve([
                new App(1, "Hopper User Service", require("./img/logo_small.svg"), false, false),
                new App(2, "WhatsApp", require("./img/logo_small.svg"), true, false),
                new App(3, "Deutsche Bank", require("./img/logo_small.svg"), true, false),
                new App(3, "Studierendenwerk Karlsruhe", require("./img/logo_small.svg"), false, true),
            ]);
        })
    }

    public async getNotifications(includeDone: boolean, app: number|undefined, offset: number, limit: number): Promise<Notification[]> {
        return new Promise<Notification[]>(resolve => {
            console.log("## DUMMY API ##: getNotifications(..)");
            resolve([ ]);
        })
    }

    private sessionId: string;

    constructor(sessionId: string) {
        this.sessionId = sessionId;
    }


}