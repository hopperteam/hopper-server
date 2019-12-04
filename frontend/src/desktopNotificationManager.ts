export class DesktopNotificationManager {
    public static hasPermission() {
        return Notification.permission == "granted";
    }

    public static canRequestPermission() {
        return Notification.permission == "default";
    }

    public static async requestPermissions() {
        await Notification.requestPermission();
    }
}
