export default class HopperAdapter {
    apps = {};
    nextId = 1000000;

    notifications= {};

    async getAppId(name, driver) {
        if (!( name in this.apps)) {
            this.apps[name] = ++this.nextId;
            await this.insertApp(driver, this.apps[name], name)
        }
        return this.apps[name];
    }

    getNotificationId(name) {
        if (!( name in this.notifications)) {
            this.notifications[name] = ++this.nextId;
        }
        return this.notifications[name];
    }

    async setup(driver) {
        await driver.executeScript(function () {
            document._dummyApiIgnoreErrors = true;
        });
    }

    async insertApp(driver, id, name) {
        await driver.executeScript(function() {
            let controller = document._loadingController;

            controller.insertSubscription(
                {
                    id: arguments[0],
                    app: {
                        id: arguments[0]+ "-app",
                        baseUrl: "",
                        imageUrl: "",
                        isActive: true,
                        isHidden: false,
                        manageUrl: "",
                        name: arguments[1]
                    }
                }
            );
            document._updateHopperUi();
        }, id, name);
    }

    async insertNotification(driver, name, sender) {
        await driver.executeScript(function() {
            let controller = document._loadingController;

            controller.notificationSet.integrateNotifications([
                {
                    id: arguments[0],
                    heading: arguments[1],
                    content: arguments[1],
                    subscription: arguments[2],
                    type: "default",
                    isSilent: false,
                    isDone: false,
                    actions: [],
                    timestamp: Date.now(),
                }
            ]);
            controller.rootCategory.loaded += 1;
            controller.subscriptionCategories[arguments[2]].loaded += 1;
            document._updateHopperUi();
        }, this.getNotificationId(name), name, await this.getAppId(sender, driver));
    }

    async isNotificationDone(driver, name) {
        let id = this.getNotificationId(name);
        return driver.executeScript(function () {
            let controller = document._loadingController;
            return controller.notificationSet.notifications[arguments[0]].isDone
        }, id);
    }

}
