import * as express from 'express';
import Handler from './handler';
import App, {IApp} from '../types/app';
import Notification, { INotification } from '../types/notification';
import Subscription, { ISubscription } from '../types/subscription';
import Log from '../log';
import * as utils from '../utils';
import {WebSocketManager} from "../webSocketManager";

const log: Log = new Log("SPHandler");

export default class SPHandler extends Handler {
    private webSocketManager: WebSocketManager;

    constructor(webSocketManager: WebSocketManager) {
        super();
        this.webSocketManager = webSocketManager;
        this.router.post("/app", this.postApp.bind(this));
        this.router.put("/app", this.putApp.bind(this));
        this.router.post("/notification", this.postNotification.bind(this));
        this.router.put("/notification", this.putNotification.bind(this));
        this.router.delete("/notification", this.deleteNotification.bind(this));
    }

    private async postApp(req: express.Request, res: express.Response): Promise<void> {
        App.sanitize(req.body, false);

        let app: IApp;
        try {
            app = await App.create(req.body);
        } catch (e) {
            log.error(e.message)
            utils.writeDBError(e, res);
            return
        }

        log.info("Created app: " + JSON.stringify(app));
        res.json({
            "status": "success",
            "id": app._id
        });
    }

    private async putApp(req: express.Request, res: express.Response): Promise<void> {
        let app: IApp | null;
        try {
            app = await App.findById(req.body.id);
        } catch (e) {
            log.error(e.message);
            utils.writeDBError(e, res);
            return;
        }

        if (!app) {
            log.warn("Could not find app");
            utils.writeError("Could not find app", res);
            return;
        }

        let data = await utils.decryptContent(app.cert, req.body.content);
        if (data === undefined) {
            log.warn("Could not verify");
            utils.writeError("Could not verify", res);
            return;
        }

        App.sanitize(data, true);
        try {
            await app.updateOne(data);
        } catch (e) {
            log.error(e.message);
            utils.writeDBError(e, res);
            return;
        }

        this.webSocketManager.loadAndUpdateSubscriptionsForAppInBackground(app._id);
        log.info("Updated app: " + JSON.stringify(app));
        res.json({
            "status": "success"
        });
    }

    private async postNotification(req: express.Request, res: express.Response): Promise<void> {
        let subscription: ISubscription | null;
        try {
            subscription = await Subscription.findById(req.body.subscriptionId);
        } catch (e) {
            log.error(e.message);
            utils.writeDBError(e, res);
            return;
        }

        if (!subscription) {
            log.warn("No valid subscription");
            utils.writeError("No valid subscription", res);
            return;
        }

        Notification.sanitize(req.body.notification, false);
        req.body.notification.userId = subscription.userId;
        req.body.notification.subscription = subscription._id;
        let notification: INotification;
        try {
            notification = await Notification.create(req.body.notification);
        } catch (e) {
            log.error(e.message);
            utils.writeDBError(e, res);
            return;
        }

        this.webSocketManager.createNotification(notification, subscription.userId);
        log.info("Created notification: " + JSON.stringify(notification));
        res.json({
            "status": "success",
            "id": notification._id
        });
    }

    private async putNotification(req: express.Request, res: express.Response): Promise<void> {
        Notification.sanitize(req.body.notification, false);
        let notification: INotification | null;
        try {
            notification = await Notification.findByIdAndUpdate(req.body.id, req.body.notification);
        } catch (e) {
            log.error(e.message);
            utils.writeDBError(e, res);
            return;
        }

        this.webSocketManager.loadAndUpdateNotificationInBackground(req.body.id);
        log.info("Updated notification: " + JSON.stringify(notification));
        res.json({
            "status": "success"
        });
    }

    private async deleteNotification(req: express.Request, res: express.Response): Promise<void> {
        let notification: INotification | null;
        try {
            notification = await Notification.findByIdAndDelete(req.query.id);
        } catch (e) {
            log.error(e.message);
            utils.writeDBError(e, res);
            return;
        }

        if (!notification) {
            log.warn("Could not find notification");
            utils.writeError("Could not find notification", res);
            return;
        }

        this.webSocketManager.deleteNotification(notification._id, notification.userId);
        log.info("Deleted notification: " + JSON.stringify(notification));
        res.json({
            "status": "success"
        });
    }
}
