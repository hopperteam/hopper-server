import * as express from 'express';
import Handler from './handler';
import App from '../types/app';
import Subscription from '../types/subscription';
import SubscribeRequest from '../types/subscribeRequest';
import Log from '../log';
import * as utils from '../utils';
import {WebSocketManager} from "../webSocketManager";

const log: Log = new Log("SubscriptionHandler");

export default class SubscriptionHandler extends Handler {
    private webSocketManager: WebSocketManager;

    constructor(webSocketManager: WebSocketManager) {
        super();
        this.webSocketManager = webSocketManager;
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
            await Subscription.findByIdAndDelete(req.query.id);

            this.webSocketManager.deleteSubscription(req.query.id, req.session.userId, req.session.id);
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
            let data = utils.decryptContent(app.cert, req.query.content);
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
            let data = utils.decryptContent(app.cert, req.body.content);
            let subscription = await Subscription.create({ userId: req.session.userId, accountName: data.accountName, app: app._id });

            this.webSocketManager.loadAndCreateSubscriptionInBackground(subscription._id, req.session.userId);
            res.json({
                "status": "success",
                "subscriptionId": subscription._id
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }
}
