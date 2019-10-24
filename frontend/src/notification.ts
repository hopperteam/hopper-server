export class Notification {
    readonly id: number;
    readonly sender: App;
    readonly heading: string;
    readonly body: string;
    readonly timestamp: number;
    readonly imageLink: string|undefined;

    constructor(id: number, sender: App, heading: string, body: string, timestamp: number, imageLink: string|undefined = undefined) {
        this.id = id;
        this.sender = sender;
        this.heading = heading;
        this.body = body;
        this.timestamp = timestamp;
        this.imageLink = imageLink;
    }
}

export class App {
    readonly id: number;
    readonly name: string;
    readonly imageLink: string;

    constructor(id: number, name: string, imageLink: string) {
        this.id = id;
        this.name = name;
        this.imageLink = imageLink;
    }
}

class TimestampOrderedList {
    public data: {id: number, timestamp: number}[];

    constructor() {
        this.data = [];
    }

    private searchTimestamp(timestamp: number): number {
        for (let i = this.data.length - 1; i >= 0; i--) {
            if (this.data[i].timestamp >= timestamp) return i;
        }
        return -1;
    }

    public insertTimestamp(id: number, timestamp: number) {
        let ind = this.searchTimestamp(timestamp);
        this.data.splice(ind + 1, 0, {id: id, timestamp: timestamp});
    }

    public removeTimestamp(id: number, timestamp: number) {
        let ind = this.searchTimestamp(timestamp);
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

export class NotificationSet {
    notifications: { [index: number] : Notification};
    apps: { [index: number] : TimestampOrderedList};
    timeOrdered: TimestampOrderedList;

    constructor() {
        this.notifications = {};
        this.apps = {};
        this.timeOrdered = new TimestampOrderedList()
    }

    private insertNotification(not: Notification) {
        this.notifications[not.id] = not;
        this.timeOrdered.insertTimestamp(not.id, not.timestamp);
        let x = this.apps[not.sender.id];
        if (x == undefined) {
            x = (this.apps[not.sender.id] = new TimestampOrderedList());
        }
        x.insertTimestamp(not.id, not.timestamp);
    }

    public has(id: number): boolean {
        return id in this.notifications
    }

    public integrateNotifications(not: Notification[]) {
        not.filter(n => !this.has(n.id)).forEach(n => this.insertNotification(n));
    }

    public updateNotitifaction(not: Notification) {
        this.deleteNotification(not.id);
        this.insertNotification(not);
    }

    public deleteNotification(id: number) {
        let not = this.notifications[id];
        if (not == undefined) return;
        delete this.notifications[id];

        this.apps[not.sender.id].removeTimestamp(id, not.timestamp);
        this.timeOrdered.removeTimestamp(id, not.timestamp);
    }

    public getNotification(id: number): Notification {
        return this.notifications[id];
    }

    public getUnfilteredIterator(): NotificationIterator {
        return new TimestampOrderedListIterator(this, this.timeOrdered);
    }
}

export interface NotificationIterator {
    available(): boolean
    next(): Notification
    reset(): void
    map(fnc: ((x: Notification) => any)): any
}

class TimestampOrderedListIterator implements NotificationIterator {
    private tol: TimestampOrderedList;
    private set: NotificationSet;
    private ind: number = 0;

    constructor(set: NotificationSet, tol: TimestampOrderedList) {
        this.tol = tol;
        this.set = set;
    }

    available(): boolean {
        return this.ind < this.tol.data.length;
    }

    next(): Notification {
        return this.set.getNotification(this.tol.data[this.ind++].id);
    }

    reset(): void {
        this.ind = 0;
    }

    map(fnc: (x: Notification) => any): any {
        return this.tol.data.map( i => {
            return fnc(this.set.getNotification(i.id));
        })
    }

}
