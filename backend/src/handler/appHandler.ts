import * as express from 'express';
import Handler from './handler';
import App from '../types/app';
import Subscription from '../types/subscription';
import SubscribeRequest from '../types/subscribeRequest';
import Log from '../log';
import * as utils from '../utils';

const log: Log = new Log("AppHandler");

export default class AppHandler extends Handler {
    
    constructor() {
        super();
        this.router.get("/apps", this.getApps.bind(this));
        this.router.delete("/apps", this.deleteApp.bind(this));
        this.router.get("/subscribeRequest", this.getSubscribeRequest.bind(this));
        this.router.post("/subscribeRequest", this.postSubscribeRequest.bind(this));
    }
    
    private async getApps(req: express.Request, res: express.Response): Promise<void> {
        try {
            let apps: any[] = [];
            let query = await Subscription.find({ userId: req.session.userId }).populate('app', { cert: 0 });
            query.forEach((subscription) => apps.push(subscription.app));
            res.json(apps);
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async deleteApp(req: express.Request, res: express.Response): Promise<void> {
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
