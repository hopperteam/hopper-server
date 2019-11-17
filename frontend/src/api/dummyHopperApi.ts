import {Action, App, Notification, SubscribeRequest, User} from "types";
import {IHopperApi} from "api/hopperApi";

const LOADING_TIME = 1000;

function _createApp (id: string, name: string, imageUrl: string, isActive: boolean, isHidden: boolean, baseUrl: string, manageUrl: string): App {
    return {
        id: id,
        name: name,
        imageUrl: imageUrl,
        isActive: isActive,
        isHidden: isHidden,
        baseUrl: baseUrl,
        manageUrl: manageUrl
    };
}

const DEMO_APPS = [
    _createApp("1", "Hopper User Service", require("../img/logo_small.svg"), true, true,"hoppercloud.net", "https://app.hoppercloud.net"),
    _createApp("2", "WhatsApp", "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", true, false, "whatsapp.com", "https://manage.hopper.whatsapp.com"),
    _createApp("3", "Deutsche Bank", "https://upload.wikimedia.org/wikipedia/commons/7/7b/Deutsche_Bank_logo_without_wordmark.svg", true, false, "deutsche-bank.de", "https://hopper.deutsche-bank.de"),
    _createApp("4", "Studierendenwerk Karlsruhe", "https://www.jobs-studentenwerke.de/sites/default/files/styles/logo_studentenwerk/public/user-files/Studierendenwerk%20Karlsruhe/logos/swka_farbig.png?itok=55RSWEF6", false, true, "sw-ka.de", "https://account.hopper.sw-ka.de"),
];

function _createNotification(id: string, heading: string, serviceProvider: string, timestamp: number, imageUrl: string | undefined, isDone: boolean, isSilent: boolean, type: string, content: any, actions: Action[]): Notification {
    return {
        id: id,
        heading: heading,
        serviceProvider: serviceProvider,
        timestamp: timestamp,
        imageUrl: imageUrl,
        isDone: isDone,
        isSilent: isSilent,
        type: type,
        content: content,
        actions: actions
    };
}

const DEMO_NOTIFICATIONS = [
    _createNotification("1","Account created", "1", Math.floor(Date.now() / 1000) - 100, undefined, false, false, "default", "Welcome to your hopper account!", []),
    _createNotification("2","Welcome!", "1", Math.floor(Date.now() / 1000), undefined, false, false, "default", "Notifications will appear here!", []),
    _createNotification("3","1 new transaction", "3", Math.floor(Date.now() / 1000), undefined, false, true, "default", "+ 500€ from Marc Jacob", []),
    _createNotification("4","2 new transactions", "3", Math.floor(Date.now() / 1000), undefined, false, false, "default", "- 200 € to Konrad Hartwig\n+ 7,50€ from DHBW Karlsruhe", []),
    _createNotification("5","1 new message from your caretaker", "4", Math.floor(Date.now() / 1000) - 4000, undefined, true, false, "default", "1 new message", []),
    _createNotification("6","Max Müller", "2", Math.floor(Date.now() / 1000) - 23000, undefined, false, false, "default", "Wanna have a drink tonight?", []),
    _createNotification("7","Marie Mustermann", "2", Math.floor(Date.now() / 1000)  - 30, undefined, true, false, "default", "What are you doing later today?", []),
    _createNotification("8","1 new message in your postbox", "3", Math.floor(Date.now() / 1000)  - 500, undefined, false, false, "default", "Tax refund", []),
    _createNotification("9","You still have to pay your rent", "4", Math.floor(Date.now() / 1000)  - 200, undefined, false, false, "default", "2 days overdue", []),
];

export default class DummyHopperApi implements IHopperApi {
    public async login(email: string, password: string) {
        return true;
    }

    public async getApps(): Promise<App[]> {
        return new Promise<App[]>(resolve => {
            console.log("## DUMMY API ##: getApps()");
            resolve(DEMO_APPS);
        });
    }

    public async getNotifications(includeDone: boolean, app: string | undefined, offset: number, limit: number): Promise<Notification[]> {
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

    getCurrentUser(): Promise<User|undefined> {
        return new Promise<User|undefined>(resolve => {
            setTimeout(() => {
                resolve({firstName: "Test", lastName: "User", email: "testuser@hoppercloud.net"});
            }, LOADING_TIME);
        });
    }

    async getSubscribeRequest(data: string, appId: string): Promise<SubscribeRequest | undefined> {
        return {
            id: "1",
            name: "Max Mustermann",
            callback: "https://dummy.hoppercloud.net/cb?usrId=1234",
            requestedInfos: []
        };
    }

    async postSubscribeRequest(data: string, appId: string): Promise<string | undefined> {
        return "1234563241324718973";
    }

}