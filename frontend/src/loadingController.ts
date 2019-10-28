import HopperApi from "./api";
import {NotificationSet, TimestampOrderedList} from "./notificationSet";
import {Notification} from "./types";

const LOAD_BATCH_SIZE = 5;

class LoadedCategory {
    loaded: number = 0;
    moreDoneAvailable: boolean = true;
    moreUndoneAvailable: boolean = true;
}

export default class LoadingController {
    private api: HopperApi;
    private notificationSet: NotificationSet;

    private readonly rootCategory: LoadedCategory;
    private readonly appCategories: { [index: string]: (LoadedCategory) };


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

    public getLoaded(includeDone: boolean, app: string | undefined = undefined): number {
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

    private getTol(includeDone: boolean, app: string | undefined): TimestampOrderedList {
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

    public getMapFunction(includeDone: boolean, app: string | undefined): (fnc: (x: Notification) => any) => any[] {
        return (fnc: (x: Notification) => any) => {
            let n = this.getLoaded(includeDone, app);
            let d = this.getTol(includeDone, app);

            let el = [];

            for (let i = 0; i < n; i++) {
                el.push(fnc(this.notificationSet.getNotification(d.data[i].id)));
            }

            return el;
        }
    }

    public isFullyLoaded(includeDone: boolean, app: string | undefined = undefined): boolean {
        //if (!this.rootCategory.moreDoneAvailable) return true;
        if (!includeDone && !this.rootCategory.moreUndoneAvailable) return true;

        let cat = (app != undefined) ? this.appCategories[app] : this.rootCategory;
        return includeDone ? !cat.moreDoneAvailable : !cat.moreUndoneAvailable;
    }

    public async loadNotifications(includeDone: boolean, app: string | undefined = undefined): Promise<boolean> {
        let cat = (app != undefined) ? this.appCategories[app] : this.rootCategory;

        if (this.isFullyLoaded(includeDone, app)) {
            return false;
        }

        let loaded = this.getLoaded(includeDone, app);

        let notifications = await this.api.getNotifications(includeDone, app, loaded, LOAD_BATCH_SIZE);

        this.notificationSet.integrateNotifications(notifications);

        if (includeDone) {
            cat.loaded = loaded + notifications.length;
            // Could also add the notifications to the app category, pay attention not to double add them (in case of multiple loading at the same time)
            cat.moreDoneAvailable = (notifications.length == LOAD_BATCH_SIZE);
        } else {
            cat.moreUndoneAvailable = (notifications.length == LOAD_BATCH_SIZE);
        }

        return notifications.length != 0;
    }
}
