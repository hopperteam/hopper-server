import * as express from 'express';
import Handler from './handler';
import Notification from '../types/notification'
import Log from '../log';
import * as utils from '../utils';
import {WebSocketManager} from "../webSocketManager";

const log: Log = new Log("NotificationHandler");

export default class NotificationHandler extends Handler {
    private webSocketManager: WebSocketManager;

    constructor(webSocketManager: WebSocketManager) {
        super();
        this.webSocketManager = webSocketManager;
        this.router.get("/notifications", this.getNotifications.bind(this));
        this.router.post("/notifications/done", this.markNotificationsAsDone.bind(this));
        this.router.post("/notifications/undone", this.markNotificationsAsUndone.bind(this));
        this.router.delete("/notifications", this.deleteNotifications.bind(this));
    }

    private async getNotifications(req: express.Request, res: express.Response): Promise<void> {
        try {
            let limit: number = (req.query.limit) ? Number(req.query.limit) : 100; // TODO set default limit in config
            let skip: number = (req.query.skip) ? Number(req.query.skip) : 0;
            let criteria: any = { userId: req.session.user.id, isArchived: false }
            if (req.query.subscription)
                criteria.subscription = req.query.subscription;
            if (!req.query.includeDone || req.query.includeDone === "false")
                criteria.isDone = false;
            
            let arr = await Notification.find(criteria).skip(skip).limit(limit);
            res.json(arr);
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async markNotificationsAsDone(req: express.Request, res: express.Response): Promise<void> {
        try {
            let notification = await Notification.findOneAndUpdate({ _id: req.body.id, userId: req.session.user.id }, { isDone: true });
            if (!notification)
                throw new Error("Could not find notification");

            this.webSocketManager.loadAndUpdateNotificationInBackground(notification._id, req.session.user.id, req.session.id);
            log.info("Marked as done: " + JSON.stringify(notification));
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async markNotificationsAsUndone(req: express.Request, res: express.Response): Promise<void> {
        try {
            let notification = await Notification.findOneAndUpdate({ _id: req.body.id, userId: req.session.user.id }, { isDone: false });
            if (!notification)
                throw new Error("Could not find notification");

            this.webSocketManager.loadAndUpdateNotificationInBackground(notification._id, req.session.user.id, req.session.id);
            log.info("Marked as undone: " + JSON.stringify(notification));
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async deleteNotifications(req: express.Request, res: express.Response): Promise<void> {
        try {
            let notification = await Notification.findOneAndUpdate({ _id: req.query.id, userId: req.session.user.id }, { isArchived: true });
            if (!notification)
                throw new Error("Could not find notification");
            this.webSocketManager.deleteNotification(notification._id, req.session.user.id, req.session.id);
            log.info("Deleted notification: " + JSON.stringify(notification));
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }

    }
}
