import * as express from 'express';
import Handler from './handler';
import App, {IApp} from '../types/app';
import Subscription, { ISubscription } from '../types/subscription';
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
        let app: IApp | null;
        try {
            app = await App.findById(req.query.id);    
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

        log.info("Got app: " + JSON.stringify(app));
        res.json(app);
    }

    private async getSubscriptions(req: express.Request, res: express.Response): Promise<void> {
        let subs: ISubscription[];
        try {
            subs = await Subscription.find({ userId: req.session.user.id }).populate('app');
        } catch (e) {
            log.error(e.message);
            utils.writeDBError(e, res);
            return;
        }

        log.info("Got all");
        res.json(subs);
    }

    private async deleteSubscription(req: express.Request, res: express.Response): Promise<void> {
        let subscription: ISubscription | null;
        try {
            subscription = await Subscription.findByIdAndDelete(req.query.id);
        } catch (e) {
            log.error(e.message);
            utils.writeDBError(e, res);
            return;
        }

        if (!subscription) {
            log.warn("Could not find subscription");
            utils.writeError("Could not find subscription", res);
            return;
        }

        this.webSocketManager.deleteSubscription(req.query.id, req.session.user.id, req.session.id);
        log.info("Deleted subscription: " + JSON.stringify(subscription));
        res.json({
            "status": "success"
        });
    }

    private async getSubscribeRequest(req: express.Request, res: express.Response): Promise<void> {
        let app: IApp | null;
        try {
            app = await App.findById(req.query.id);
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

        let data = await utils.decryptContent(app.cert, req.query.content);
        if (data === undefined) {
            log.warn("Could not verify");
            utils.writeError("Could not verify", res);
            return;
        }

        data.id = req.query.id;
        let request: SubscribeRequest
        try {
        request = SubscribeRequest.fromRequestBody(data);
        } catch (e) {
            log.error(e.message);
            utils.writeError(e.message, res);
            return;
        }

        res.json({
            "status": "success",
            "subscribeRequest": request
        });
    }

    private async postSubscribeRequest(req: express.Request, res: express.Response): Promise<void> {
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

        let subscription: ISubscription;
        try {
            subscription = await Subscription.create({ userId: req.session.user.id, accountName: data.accountName, app: app._id });
        } catch (e) {
            log.error(e.message);
            utils.writeDBError(e, res);
            return;
        }
        
        this.webSocketManager.loadAndCreateSubscriptionInBackground(subscription._id, req.session.user.id);
        log.info("Created subscription: " + JSON.stringify(subscription));
        res.json({
            "status": "success",
            "subscriptionId": subscription._id
        });
    }
}
