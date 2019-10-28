import HopperApi from "./api";
import {Notification, NotificationSet, TimestampOrderedList} from "./notification";

const LOAD_BATCH_SIZE = 5;

class LoadedCategory {
    loaded: number = 0;
    moreDoneAvailable: boolean = true;
    moreUndoneAvailable: boolean = true;
}

export default class LoadingController {
    private api: HopperApi;
    private notificationSet: NotificationSet;

    private rootCategory: LoadedCategory;
    private appCategories: { [index: number] : (LoadedCategory)};


    constructor(api: HopperApi, notificationSet: NotificationSet) {
        this.api = api;
        this.notificationSet = notificationSet;
        this.appCategories = {};
        this.rootCategory = new LoadedCategory();
    }

    public async loadApps() {
        let apps = await this.api.getApps();

        apps.map(app => {
            this.appCategories[app.id] = new LoadedCategory();
            this.notificationSet.insertApp(app);
        });
    }

    public getLoaded(includeDone: boolean, app: number|undefined = undefined): number {
        if (!includeDone) {
            if (app == undefined)
                return this.notificationSet.rootCategory.open.data.length;
            return this.notificationSet.appCategories[app].open.data.length;
        } else {
            if (app == undefined)
                return this.rootCategory.loaded;
            return this.appCategories[app].loaded;
        }
    }

    private getTol(includeDone: boolean, app: number|undefined): TimestampOrderedList {
        if (!includeDone) {
            if (app == undefined)
                return this.notificationSet.rootCategory.open;
            return this.notificationSet.appCategories[app].open;
        } else {
            if (app == undefined)
                return this.notificationSet.rootCategory.all;
            return this.notificationSet.appCategories[app].all;
        }
    }

    public map(includeDone: boolean, app: number|undefined, fnc: (x: Notification) => any): any[] {
        let n = this.getLoaded(includeDone, app);
        let d = this.getTol(includeDone, app);

        let el = [];

        for (let i = 0; i < n; i++) {
            el.push(fnc(this.notificationSet.getNotification(d.data[i].id)));
        }

        return el;
    }

    public async loadNotifications(includeDone: boolean, app: number|undefined = undefined): Promise<boolean> {
        let cat = (app != undefined) ? this.appCategories[app] : this.rootCategory;
        let moreAv = includeDone ? cat.moreDoneAvailable : cat.moreUndoneAvailable;

        if (!moreAv) {
            return false;
        }

        let notifications = await this.api.getNotifications(includeDone, app, this.getLoaded(includeDone, app), LOAD_BATCH_SIZE);

        if (includeDone) {
            cat.moreDoneAvailable = (notifications.length == LOAD_BATCH_SIZE);
            cat.loaded += notifications.length;
        } else {
            cat.moreUndoneAvailable = (notifications.length == LOAD_BATCH_SIZE);
        }

        this.notificationSet.integrateNotifications(notifications);

        return notifications.length != 0;
    }
}
