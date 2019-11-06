import * as express from 'express';
import Handler from './handler';
import App from '../types/app';
import Notification from '../types/notification';
import Subscription from '../types/subscription';
import Log from '../log';
import * as utils from '../utils';

const log: Log = new Log("SPHandler");

export default class SPHandler extends Handler {

    constructor() {
        super();
        this.router.post("/app", this.postApp.bind(this));
        this.router.put("/app", this.putApp.bind(this));
        this.router.post("/notification", this.postNotification.bind(this));
        this.router.put("/notification", this.putNotification.bind(this));
        this.router.delete("/notification", this.deleteNotification.bind(this));
    }

    private async postApp(req: express.Request, res: express.Response): Promise<void> {
        try {
            let app = await App.create(req.body);
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
            let data = utils.decryptContent(app.cert, req.body.data);
            if (data.id != app._id)
                throw new Error("Could not verify data");
            delete data.baseUrl;
            await app.updateOne(data);
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
            if (!subscription || subscription.app != req.body.notification.serviceProvider)
                throw new Error("No valid subscription");
            req.body.notification.userId = subscription.userId;
            let notification = await Notification.create(req.body.notification);
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
            await Notification.findByIdAndUpdate(req.body.id, req.body.notification);
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async deleteNotification(req: express.Request, res: express.Response): Promise<void> {
        try {
            await Notification.findByIdAndDelete(req.query.id);
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }
}
