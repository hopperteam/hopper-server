import * as express from 'express';
import Handler from './handler';
import App from '../types/app';
import Subscription from '../types/subscription';
import SubscribeRequest from '../types/subscribeRequest';
import Log from '../log';
import * as utils from '../utils';

const log: Log = new Log("SubscriptionHandler");

export default class SubscriptionHandler extends Handler {
    
    constructor() {
        super();
        this.router.get("/apps", this.getApp.bind(this));
        this.router.get("/subscriptions", this.getSubscriptions.bind(this));
        this.router.delete("/subscriptions", this.deleteSubscription.bind(this));
        this.router.get("/subscribeRequest", this.getSubscribeRequest.bind(this));
        this.router.post("/subscribeRequest", this.postSubscribeRequest.bind(this));
    }

    private async getApp(req: express.Request, res: express.Response): Promise<void> {
        try {
            let app = await App.findById(req.query.id, { cert: 0 });
            if (!app)
                throw new Error("Could not find app");
            res.json(app);
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }
    
    private async getSubscriptions(req: express.Request, res: express.Response): Promise<void> {
        try {
            let subs = await Subscription.find({ userId: req.session.userId }, { userId: 0 }).populate('app', { cert: 0 });
            res.json(subs);
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async deleteSubscription(req: express.Request, res: express.Response): Promise<void> {
        try {
            await Subscription.findOneAndDelete({ userId: req.session.userId, app: req.query.id });
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async getSubscribeRequest(req: express.Request, res: express.Response): Promise<void> {
        try {
            let app = await App.findById(req.query.id);
            if (!app)
                throw new Error("Could not find app");
            let data = utils.decryptContent(app.cert, req.query.data);
            if (data.id != app._id)
                throw new Error("Could not verify data");
            let request: SubscribeRequest = SubscribeRequest.fromRequestBody(data);
            res.json({
                "status": "success",
                "subscribeRequest": request
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async postSubscribeRequest(req: express.Request, res: express.Response): Promise<void> {
        try {
            let app = await App.findById(req.body.id);
            if (!app)
                throw new Error("Could not find app");
            let data = utils.decryptContent(app.cert, req.body.data);
            if (data.id != app._id)
                throw new Error("Could not verify data");
            let subscription = await Subscription.create({ userId: req.session.userId, app: app._id });
            res.json({
                "status": "success",
                "subscriptionId": subscription._id
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }
}
