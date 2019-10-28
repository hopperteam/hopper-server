import {App} from "./types";
import {Notification} from "./types";

const LOADING_TIME = 2000;

const DEMO_APPS = [
    new App(1, "Hopper User Service", require("./img/logo_small.svg"), true, true,"hoppercloud.net", "https://app.hoppercloud.net"),
    new App(2, "WhatsApp", require("./img/logo_small.svg"), true, false, "whatsapp.com", "https://manage.hopper.whatsapp.com"),
    new App(3, "Deutsche Bank", require("./img/logo_small.svg"), true, false, "deutsche-bank.de", "https://hopper.deutsche-bank.de"),
    new App(4, "Studierendenwerk Karlsruhe", require("./img/logo_small.svg"), false, true, "sw-ka.de", "https://account.hopper.sw-ka.de"),
];

const DEMO_NOTIFICATIONS = [
    new Notification(1,"Account created", 1, Date.now() - 100, undefined, false, false, "default", "Welcome to your hopper account!", []),
    new Notification(2,"Welcome!", 1, Date.now(), undefined, false, false, "default", "Notifications will appear here!", []),
    new Notification(3,"1 new transaction", 3, Date.now(), undefined, false, true, "default", "+ 500€ from Marc Jacob", []),
    new Notification(4,"2 new transactions", 3, Date.now(), undefined, false, false, "default", "- 200 € to Konrad Hartwig\n+ 7,50€ from DHBW Karlsruhe", []),
    new Notification(5,"1 new message from your caretaker", 4, Date.now(), undefined, true, false, "default", "1 new message", []),
    new Notification(6,"Max Müller", 2, Date.now(), undefined, false, false, "default", "Wanna have a drink tonight?", []),
    new Notification(7,"Marie Mustermann", 2, Date.now() - 30, undefined, true, false, "default", "What are you doing later today?", []),
    new Notification(8,"1 new message in your postbox", 3, Date.now() - 500, undefined, false, false, "default", "Tax refund", []),
    new Notification(9,"You still have to pay your rent", 4, Date.now() - 200, undefined, false, false, "default", "2 days overdue", []),
];

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
            resolve(DEMO_APPS);
        })
    }

    public async getNotifications(includeDone: boolean, app: number|undefined, offset: number, limit: number): Promise<Notification[]> {
        return new Promise<Notification[]>(resolve => {
            console.log("## DUMMY API ##: getNotifications(" + includeDone + ", " + app + ", " + offset + ", " + limit + ")");
            setTimeout(() => {
                let filtered = DEMO_NOTIFICATIONS
                    .filter(x => (app == undefined) || x.serviceProvider == app)
                    .filter(x => includeDone || !x.isDone)
                    .sort((x, y) => y.timestamp - x.timestamp);

                resolve(filtered.slice(offset, offset + limit));
            }, LOADING_TIME);
        });
    }

    private sessionId: string;

    constructor(sessionId: string) {
        this.sessionId = sessionId;
    }

}
