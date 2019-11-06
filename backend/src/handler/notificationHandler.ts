import * as express from 'express';
import Handler from './handler';
import Notification from '../types/notification'
import Log from '../log';
import * as utils from '../utils';

const log: Log = new Log("NotificationHandler");

export default class NotificationHandler extends Handler {

    constructor() {
        super();
        this.router.get("/notifications", this.getNotifications.bind(this));
        this.router.post("/notifications/done", this.markNotificationsAsDone.bind(this));
        this.router.delete("/notifications", this.deleteNotifications.bind(this));
    }

    private async getNotifications(req: express.Request, res: express.Response): Promise<void> {
        try {
            let limit: number = (req.query.limit) ? Number(req.query.limit) : 100; // TODO set default limit in config
            let skip: number = (req.query.skip) ? Number(req.query.skip) : 0;
            let criteria: any = { userId: req.session.userId, isArchived: false }
            if (req.query.app)
                criteria.serviceProvider = req.query.app
            if (!req.query.includeDone)
                criteria.isDone = false;
            // the resulting behaviour is that if includeDone is set in some way, "done" notifications will be returned
            // it does not depend on the actual value of the query parameter
            // possible fix: include express query boolean parser as middleware and rework this logic
            let arr = await Notification.find(criteria, { isArchived: 0, userId: 0 }).skip(skip).limit(limit);
            res.json(arr);
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async markNotificationsAsDone(req: express.Request, res: express.Response): Promise<void> {
        try {
            let notification = await Notification.findOneAndUpdate({ _id: req.query.id, userId: req.session.userId }, { isDone: true });
            if (!notification)
                throw new Error("Could not find notification");
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async deleteNotifications(req: express.Request, res: express.Response): Promise<void> {
        try {
            let notification = await Notification.findOneAndUpdate({ _id: req.query.id, userId: req.session.userId }, { isArchived: true });
            if (!notification)
                throw new Error("Could not find notification");
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
        
    }
}
