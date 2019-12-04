import {App, Notification, Subscription} from "types";

const UNKNOWN_SUBSCRIPTION: Subscription = {
    id: "UNKNOWN",
    app: {
        id: "UNKNOWN",
        name: "Unknown App",
        imageUrl: require("img/unknown_app.svg"),
        isActive: false,
        isHidden: true,
        baseUrl: document.location.protocol + "//"  + document.location.host,
        manageUrl: document.location.protocol + "//"  + document.location.host
    }
}

export class TimestampOrderedList {
    public data: {id: string, timestamp: number}[];

    constructor() {
        this.data = [];
    }

    private searchTimestamp(timestamp: number): number {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].timestamp <= timestamp) return i;
        }
        return -1;
    }

    public getIndex(id: string, timestamp: number): number {
        let fId = this.searchTimestamp(timestamp);
        for (; fId < this.data.length && this.data[fId].timestamp >= timestamp; fId++) {
            if (this.data[fId].id == id) return fId;
        }
        return -1;
    }

    public insertTimestamp(id: string, timestamp: number) {
        let ind = this.searchTimestamp(timestamp);
        this.data.splice(ind, 0, {id: id, timestamp: timestamp});
    }

    public removeTimestamp(id: string, timestamp: number) {
        let ind = this.searchTimestamp(timestamp);
        if (ind == -1) return;
        for (; ind < this.data.length && this.data[ind].timestamp >= timestamp; ind++) {
            if (this.data[ind].id == id) {
                this.data.splice(ind, 1);
                return;
            }
        }
    }
}

class NotificationCategory {
    public all: TimestampOrderedList;
    public open: TimestampOrderedList;

    constructor() {
        this.all = new TimestampOrderedList();
        this.open = new TimestampOrderedList();
    }

    public insertTimestamp(id: string, timestamp: number, done: boolean) {
        this.all.insertTimestamp(id, timestamp);
        if (!done) {
            this.open.insertTimestamp(id, timestamp);
        }
    }

    public removeTimestamp(id: string, timestamp: number) {
        this.all.removeTimestamp(id, timestamp);
        this.open.removeTimestamp(id, timestamp);
    }
}

export class NotificationSet {
    public notifications: { [index: string] : Notification};
    public subscriptions: { [index: string] : Subscription};
    public subscriptionCategories: { [index: string] : (NotificationCategory)};
    public rootCategory: NotificationCategory;

    constructor() {
        this.notifications = {};
        this.subscriptions = {};
        this.subscriptionCategories = {};
        this.rootCategory = new NotificationCategory()
    }

    public insertSubscription(subscription: Subscription) {
        this.subscriptions[subscription.id] = subscription;
        this.subscriptionCategories[subscription.id] = new NotificationCategory();
    }

    public deleteSubscription(subscriptionId: string) {
        delete this.subscriptions[subscriptionId];
        if (subscriptionId in this.subscriptionCategories)
            delete this.subscriptionCategories[subscriptionId];
    }

    private insertNotification(not: Notification) {
        this.notifications[not.id] = not;
        this.rootCategory.insertTimestamp(not.id, not.timestamp, not.isDone);
        if (not.subscription in this.subscriptionCategories)
            this.subscriptionCategories[not.subscription].insertTimestamp(not.id, not.timestamp, not.isDone);
    }

    public hasNotification(id: string): boolean {
        return id in this.notifications
    }

    public integrateNotifications(not: Notification[]) {
        not.filter(n => !this.hasNotification(n.id)).forEach(n => this.insertNotification(n));
    }

    public updateNotification(not: Notification) {
        this.deleteNotification(not.id);
        this.insertNotification(not);
    }

    public deleteNotification(id: string) {
        let not = this.notifications[id];
        if (not == undefined) return;
        delete this.notifications[id];

        this.rootCategory.removeTimestamp(id, not.timestamp);
        if (not.subscription in this.subscriptionCategories)
            this.subscriptionCategories[not.subscription].removeTimestamp(id, not.timestamp);
    }

    public getNotification(id: string): Notification {
        return this.notifications[id];
    }

    public getSubscriptionOrDefault(id: string): Subscription {
        if (id in this.subscriptions)
            return this.subscriptions[id];
        return UNKNOWN_SUBSCRIPTION;
    }
}


