import * as express from 'express';
import Handler from './handler';
import App from '../types/app';
import Notification from '../types/notification';
import Subscription from '../types/subscription';
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
        try {
            let app = await App.create(req.body);
            log.info("Created app: " + JSON.stringify(app));
            res.json({
                "status": "success",
                "id": app._id
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async putApp(req: express.Request, res: express.Response): Promise<void> {
        try {
            let app = await App.findById(req.body.id);
            if (!app)
                throw new Error("Could not find app");
            let data = await utils.decryptContent(app.cert, req.body.content);
            if (data === undefined) {
                utils.handleError(new Error("Could not verify"), log, res);
                return;
            }
            delete data.baseUrl;
            await app.updateOne(data);
            this.webSocketManager.loadAndUpdateSubscriptionsForAppInBackground(app._id);
            log.info("Updated app: " + JSON.stringify(app));
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async postNotification(req: express.Request, res: express.Response): Promise<void> {
        try {
            let subscription = await Subscription.findById(req.body.subscriptionId);
            if (!subscription)
                throw new Error("No valid subscription");
            Notification.sanitize(req.body.notification, false);
            req.body.notification.userId = subscription.userId;
            req.body.notification.subscription = subscription._id;
            let notification = await Notification.create(req.body.notification);
            this.webSocketManager.createNotification(notification, subscription.userId);
            log.info("Created notification: " + JSON.stringify(notification));
            res.json({
                "status": "success",
                "id": notification._id
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async putNotification(req: express.Request, res: express.Response): Promise<void> {
        try {
            Notification.sanitize(req.body.notification, false);
            let notification = await Notification.findByIdAndUpdate(req.body.id, req.body.notification);
            this.webSocketManager.loadAndUpdateNotificationInBackground(req.body.id);
            log.info("Updated notification: " + JSON.stringify(notification));
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async deleteNotification(req: express.Request, res: express.Response): Promise<void> {
        try {
            let notification = await Notification.findByIdAndDelete(req.query.id);
            if (notification != null) {
                this.webSocketManager.deleteNotification(notification._id, notification.userId);
            }
            log.info("Deleted notification: " + JSON.stringify(notification));
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }
}
