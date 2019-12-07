import {Action, App, Notification, SubscribeRequest, Subscription, User} from "types";
import {IHopperApi} from "api/hopperApi";

const LOADING_TIME = 100;

function _createSubscription(id: string, app: App,  accountName?: string) {
    return {
        id: id,
        accountName: accountName,
        app: app
    }
}

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

const DEMO_SUBSCRIPTIONS = [
    _createSubscription(
        "1234",
        _createApp("1", "Hopper User Service", require("../img/logo_small.svg"), true, true,"hoppercloud.net", "https://app.hoppercloud.net"),
    ),
    _createSubscription(
        "abcd",
        _createApp("2", "WhatsApp", "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", true, false, "whatsapp.com", "https://manage.hopper.whatsapp.com"),
        "Max Mustermann"
    ),
    _createSubscription(
        "fbac",
        _createApp("3", "Deutsche Bank", "https://upload.wikimedia.org/wikipedia/commons/7/7b/Deutsche_Bank_logo_without_wordmark.svg", true, false, "deutsche-bank.de", "https://hopper.deutsche-bank.de"),
        "Fr. Müller"
    ),
    _createSubscription(
        "xbda",
        _createApp("4", "Studierendenwerk Karlsruhe", "https://www.jobs-studentenwerke.de/sites/default/files/styles/logo_studentenwerk/public/user-files/Studierendenwerk%20Karlsruhe/logos/swka_farbig.png?itok=55RSWEF6", false, true, "sw-ka.de", "https://account.hopper.sw-ka.de"),
    )];

function _createNotification(id: string, heading: string, serviceProvider: string, timestamp: number, imageUrl: string | undefined, isDone: boolean, isSilent: boolean, type: string, content: any, actions: Action[]): Notification {
    return {
        id: id,
        heading: heading,
        subscription: serviceProvider,
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
    _createNotification("1","Account created", "1234", Math.floor(Date.now()) - 100, undefined, false, false, "default", "Welcome to your hopper account!", []),
    _createNotification("2","Welcome!", "1234", Math.floor(Date.now()) - 500, undefined, false, false, "default", "Notifications will appear here!", []),
    _createNotification("3","1 new transaction", "fbac", Math.floor(Date.now()) - 600, undefined, false, true, "default", "+ 500€ from Marc Jacob", []),
    _createNotification("4","2 new transactions", "fbac", Math.floor(Date.now()) - 700, undefined, false, false, "default", "- 200 € to Konrad Hartwig\n+ 7,50€ from DHBW Karlsruhe", []),
    _createNotification("5","1 new message from your caretaker", "xbda", Math.floor(Date.now()) - 4000, undefined, true, false, "default", "1 new message", []),
    _createNotification("6","Max Müller", "abcd", Math.floor(Date.now()) - 23000, undefined, false, false, "default", "Wanna have a drink tonight?", []),
    _createNotification("7","Marie Mustermann", "abcd", Math.floor(Date.now())  - 30, undefined, true, false, "default", "What are you doing later today?", []),
    _createNotification("8","1 new message in your postbox", "fbac", Math.floor(Date.now())  - 900, undefined, false, false, "default", "Tax refund", []),
    _createNotification("9","You still have to pay your rent", "xbda", Math.floor(Date.now())  - 200, undefined, false, false, "default", "2 days overdue", []),
];

export default class DummyHopperApi implements IHopperApi {
    public async login(email: string, password: string) {
        return true;
    }

    public async register(email: string, password: string, firstName: string, lastName: string): Promise<[boolean, string]> {
        return [true, ""];
    }

    public async getSubscriptions(): Promise<Subscription[]> {
        return new Promise<Subscription[]>(resolve => {
            console.log("## DUMMY API ##: getSubscriptions()");
            resolve(DEMO_SUBSCRIPTIONS);
        });
    }

    public async getNotifications(includeDone: boolean, app: string | undefined, offset: number, limit: number): Promise<Notification[]> {
        return new Promise<Notification[]>(resolve => {
            console.log("## DUMMY API ##: getNotifications(" + includeDone + ", " + app + ", " + offset + ", " + limit + ")");
            setTimeout(() => {
                let filtered = DEMO_NOTIFICATIONS
                    .filter(x => (app == undefined) || x.subscription == app)
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
            accountName: "Max Mustermann",
            callback: "https://dummy.hoppercloud.net/cb?usrId=1234",
            requestedInfos: []
        };
    }

    async postSubscribeRequest(data: string, appId: string): Promise<string | undefined> {
        return "1234563241324718973";
    }

    async markNotificationAsDone(notificationId: string): Promise<boolean> {
        for (let x of DEMO_NOTIFICATIONS) {
            if (x.id == notificationId) {
                x.isDone = true;
                return true;
            }
        }
        return "_dummyApiIgnoreErrors" in document;
    }

    async markNotificationAsUndone(notificationId: string): Promise<boolean> {
        for (let x of DEMO_NOTIFICATIONS) {
            if (x.id == notificationId) {
                x.isDone = false;
                return true;
            }
        }
        return "_dummyApiIgnoreErrors" in document;

    }

    async getApp(appId: string): Promise<App | undefined> {
        return DEMO_SUBSCRIPTIONS[0].app;
    }

    async deleteNotification(notificationId: string): Promise<boolean> {
        for (let x in DEMO_NOTIFICATIONS) {
            if (DEMO_NOTIFICATIONS[x].id == notificationId) {
                delete DEMO_NOTIFICATIONS[x];
                return true;
            }
        }
        return "_dummyApiIgnoreErrors" in document;
    }

}
