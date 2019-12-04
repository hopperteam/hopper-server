import * as HopperTypes from "./types";

export class DesktopNotificationManager {
    public static hasNotificationSupport() {
        return ("Notification" in window);
    }

    public static hasPermission() {
        return this.hasNotificationSupport() && Notification.permission === "granted";
    }

    public static canRequestPermission() {
        return this.hasNotificationSupport() && Notification.permission === "default";
    }

    public static async requestPermissions() {
        await Notification.requestPermission();
    }

    public static notify(notification: HopperTypes.Notification, subscription: HopperTypes.Subscription) {
        if (!this.hasPermission()) return;
        if (notification.type != "default") return;
        let img = notification.imageUrl != undefined ? notification.imageUrl : subscription.app.imageUrl; // Kinda buggy?
        new Notification(notification.heading, {
            body: notification.content,
            icon: img,
            badge: img,
            tag: notification.id,
            silent: notification.isSilent,
            timestamp: notification.timestamp
        });
    }
}
