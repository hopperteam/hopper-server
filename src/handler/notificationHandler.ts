import * as express from 'express';
import Handler from './handler';
import Notification, { INotification } from '../types/notification'
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
        let limit: number = (req.query.limit) ? Number(req.query.limit) : 100; // TODO set default limit in config
        let skip: number = (req.query.skip) ? Number(req.query.skip) : 0;
        let criteria: any = { userId: req.session.user.id, isArchived: false }
        if (req.query.subscription)
            criteria.subscription = req.query.subscription;
        if (!req.query.includeDone || req.query.includeDone === "false")
            criteria.isDone = false;
        
        let arr: INotification[];
        try {
            arr = await Notification.find(criteria).sort({timestamp: -1}).skip(skip).limit(limit);
        } catch (e) {
            log.error(e.message);
            utils.writeDBError(e, res);
            return;
        }
        res.json(arr);
    }

    private async markNotificationsAsDone(req: express.Request, res: express.Response): Promise<void> {
        await this.markNotification(req, res, true);
    }

    private async markNotificationsAsUndone(req: express.Request, res: express.Response): Promise<void> {
        await this.markNotification(req, res, false);
    }

    private async markNotification(req: express.Request, res: express.Response, as: boolean): Promise<void> {
        let notification: INotification | null;
        try {
            notification = await Notification.findOneAndUpdate({ _id: req.body.id, userId: req.session.user.id }, { isDone: as });
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
        
        this.webSocketManager.loadAndUpdateNotificationInBackground(notification._id, req.session.user.id, req.session.id);
        log.info("Marked isDone as " + as + ": " + JSON.stringify(notification));
        res.json({
            "status": "success"
        });
    }

    private async deleteNotifications(req: express.Request, res: express.Response): Promise<void> {
        let notification: INotification | null;
        try {
            notification = await Notification.findOneAndUpdate({ _id: req.query.id, userId: req.session.user.id }, { isArchived: true });
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
        
        this.webSocketManager.deleteNotification(notification._id, req.session.user.id, req.session.id);
        log.info("Deleted notification: " + JSON.stringify(notification));
        res.json({
            "status": "success"
        });

    }
}
