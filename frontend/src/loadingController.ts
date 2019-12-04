import {NotificationSet, TimestampOrderedList} from "notificationSet";
import {Notification, Subscription} from "types";
import {IHopperApi} from "api/hopperApi";
import {DesktopNotificationManager} from "./desktopNotificationManager";

const LOAD_BATCH_SIZE = 5;

class LoadedCategory {
    loaded: number = 0;
    moreDoneAvailable: boolean = true;
    moreUndoneAvailable: boolean = true;
}

export default class LoadingController {
    private api: IHopperApi;
    readonly notificationSet: NotificationSet;

    private readonly rootCategory: LoadedCategory;
    private readonly subscriptionCategories: { [index: string]: (LoadedCategory) };

    onUpdateListener: () => void = () => {};

    constructor(api: IHopperApi, notificationSet: NotificationSet) {
        this.api = api;
        this.notificationSet = notificationSet;
        this.subscriptionCategories = {};
        this.rootCategory = new LoadedCategory();
    }

    public async loadApps() {
        let subscriptions = await this.api.getSubscriptions();

        subscriptions.map(this.insertSubscription.bind(this));
    }

    public insertSubscription(s: Subscription) {
        this.subscriptionCategories[s.id] = new LoadedCategory();
        this.notificationSet.insertSubscription(s);
    }

    public getLoaded(includeDone: boolean, subscription: string | undefined = undefined): number {
        if (!includeDone) {
            if (subscription == undefined)
                return this.notificationSet.rootCategory.open.data.length;
            return this.notificationSet.subscriptionCategories[subscription].open.data.length;
        } else {
            if (subscription == undefined)
                return this.rootCategory.loaded;
            return this.subscriptionCategories[subscription].loaded;
        }
    }

    private getTol(includeDone: boolean, subscription: string | undefined): TimestampOrderedList {
        if (!includeDone) {
            if (subscription == undefined)
                return this.notificationSet.rootCategory.open;
            return this.notificationSet.subscriptionCategories[subscription].open;
        } else {
            if (subscription == undefined)
                return this.notificationSet.rootCategory.all;
            return this.notificationSet.subscriptionCategories[subscription].all;
        }
    }

    public getMapFunction(includeDone: boolean, subscription: string | undefined): (fnc: (x: Notification) => any) => any[] {
        return (fnc: (x: Notification) => any) => {
            let n = this.getLoaded(includeDone, subscription);
            let d = this.getTol(includeDone, subscription);

            let el = [];

            for (let i = 0; i < n; i++) {
                el.push(fnc(this.notificationSet.getNotification(d.data[i].id)));
            }

            return el;
        }
    }

    public isFullyLoaded(includeDone: boolean, subscription: string | undefined = undefined): boolean {
        //if (!this.rootCategory.moreDoneAvailable) return true;
        if (!includeDone && !this.rootCategory.moreUndoneAvailable) return true;

        let cat = (subscription != undefined) ? this.subscriptionCategories[subscription] : this.rootCategory;
        return includeDone ? !cat.moreDoneAvailable : !cat.moreUndoneAvailable;
    }

    public async loadNotifications(includeDone: boolean, subscription: string | undefined = undefined): Promise<boolean> {
        let cat = (subscription != undefined) ? this.subscriptionCategories[subscription] : this.rootCategory;

        if (this.isFullyLoaded(includeDone, subscription)) {
            return false;
        }

        let loaded = this.getLoaded(includeDone, subscription);

        let notifications = await this.api.getNotifications(includeDone, subscription, loaded, LOAD_BATCH_SIZE);

        this.notificationSet.integrateNotifications(notifications);

        if (includeDone) {
            cat.loaded = loaded + notifications.length;
            // Could also add the notifications to the subscription category, pay attention not to double add them (in case of multiple loading at the same time)
            cat.moreDoneAvailable = (notifications.length == LOAD_BATCH_SIZE);
        } else {
            cat.moreUndoneAvailable = (notifications.length == LOAD_BATCH_SIZE);
        }

        return notifications.length != 0;
    }

    public async markAsDone(notification: Notification) {
        if (notification.isDone) return;
        notification.isDone = true;
        this.notificationSet.updateNotification(notification);
        if (!await this.api.markNotificationAsDone(notification.id)) {
            // Error
            notification.isDone = false;
            this.notificationSet.updateNotification(notification);
        }
        this.onUpdateListener()
    }

    public async markAsUndone(notification: Notification) {
        if (!notification.isDone) return;
        notification.isDone = false;
        this.notificationSet.updateNotification(notification);
        if (!await this.api.markNotificationAsUndone(notification.id)) {
            // Error
            notification.isDone = true;
            this.notificationSet.updateNotification(notification);
        }
        this.onUpdateListener()
    }

    public async deleteNotification(notification: Notification) {
        this.deleteNotificationFromData(notification);
        this.onUpdateListener();
        if (!await this.api.deleteNotification(notification.id)) {
            // Error
        }
    }

    private deleteNotificationFromData(notification: Notification) {
        let ind = this.notificationSet.rootCategory.all.getIndex(notification.id, notification.timestamp);
        if (this.rootCategory.loaded != 0 && ind != -1 && ind < this.rootCategory.loaded) {
            this.rootCategory.loaded--;
        }
        if (notification.subscription in this.subscriptionCategories) {
            ind = this.notificationSet.subscriptionCategories[notification.subscription].all.getIndex(notification.id, notification.timestamp);
            if (this.subscriptionCategories[notification.subscription].loaded != 0 && ind != -1 && ind < this.subscriptionCategories[notification.subscription].loaded) {
                this.subscriptionCategories[notification.subscription].loaded--;
            }
        }
        this.notificationSet.deleteNotification(notification.id);
    }

    public deleteNotificationById(id: string) {
        this.deleteNotificationFromData(this.notificationSet.getNotification(id));
        this.onUpdateListener();
    }

    public insertNotification(notification: Notification, notify: boolean = false) {
        this.notificationSet.integrateNotifications([notification]);
        if (this.rootCategory.loaded != 0 && this.notificationSet.rootCategory.all.getIndex(notification.id, notification.timestamp) < this.rootCategory.loaded || !this.rootCategory.moreDoneAvailable) {
            this.rootCategory.loaded++;
        }
        if (notification.subscription in this.subscriptionCategories
            && this.subscriptionCategories[notification.subscription].loaded != 0
            && this.notificationSet.subscriptionCategories[notification.subscription].all.getIndex(notification.id, notification.timestamp) < this.rootCategory.loaded || !this.subscriptionCategories[notification.subscription].moreDoneAvailable) {
            this.subscriptionCategories[notification.subscription].loaded++;
        }

        this.onUpdateListener();

        if (notify) {
            DesktopNotificationManager.notify(notification, this.notificationSet.getSubscriptionOrDefault(notification.subscription));
        }
    }

    public updateNotification(notification: Notification) {
        this.deleteNotificationFromData(notification);
        this.insertNotification(notification);
        this.onUpdateListener()
    }

    public updateSubscription(subscription: Subscription) {
        this.notificationSet.subscriptions[subscription.id] = subscription;
        this.onUpdateListener()
    }

    public deleteSubscription(subscriptionId: string) {
        delete this.subscriptionCategories[subscriptionId];
        this.notificationSet.deleteSubscription(subscriptionId);
    }
}
