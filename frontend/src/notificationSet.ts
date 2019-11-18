import {App, Notification} from "types";

export class TimestampOrderedList {
    public data: {id: string, timestamp: number}[];

    constructor() {
        this.data = [];
    }

    private searchTimestamp(timestamp: number): number {
        for (let i = this.data.length - 1; i >= 0; i--) {
            if (this.data[i].timestamp >= timestamp) return i;
        }
        return -1;
    }

    public insertTimestamp(id: string, timestamp: number) {
        let ind = this.searchTimestamp(timestamp);
        this.data.splice(ind + 1, 0, {id: id, timestamp: timestamp});
    }

    public removeTimestamp(id: string, timestamp: number) {
        let ind = this.searchTimestamp(timestamp);
        if (ind == -1) return;
        let indD: number;
        for (indD = ind; this.data[indD].id != id && indD != 0 && this.data[indD - 1].timestamp == timestamp; indD--) { }
        if (this.data[indD].id == id) {
            this.data.splice(indD, 1);
            return;
        }
        for (indD = ind; this.data[indD].id != id && indD != this.data.length - 1 && this.data[indD].timestamp == timestamp; indD++) { }
        if (this.data[indD].id == id) {
            this.data.splice(indD, 1);
            return;
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
    public apps: { [index: string] : App};
    public appCategories: { [index: string] : (NotificationCategory)};
    public rootCategory: NotificationCategory;

    constructor() {
        this.notifications = {};
        this.apps = {};
        this.appCategories = {};
        this.rootCategory = new NotificationCategory()
    }

    public insertApp(app: App) {
        this.apps[app.id] = app;
        this.appCategories[app.id] = new NotificationCategory();
    }

    private insertNotification(not: Notification) {
        this.notifications[not.id] = not;
        this.rootCategory.insertTimestamp(not.id, not.timestamp, not.isDone);
        this.appCategories[not.serviceProvider].insertTimestamp(not.id, not.timestamp, not.isDone);
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

        this.appCategories[not.serviceProvider].removeTimestamp(id, not.timestamp);
        this.rootCategory.removeTimestamp(id, not.timestamp);
    }

    public getNotification(id: string): Notification {
        return this.notifications[id];
    }
}


