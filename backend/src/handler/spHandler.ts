import * as express from 'express';
import Handler from './handler';
import App from '../types/app';
import User from '../types/user';
import Log from '../log';
import * as utils from '../utils';

const log: Log = new Log("SPHandler");

export default class SPHandler extends Handler {

    constructor() {
        super();
        this.router.post("/app", this.postApp.bind(this));
        this.router.put("/app", this.putApp.bind(this));
    }

    private async postApp(req: express.Request, res: express.Response): Promise<void> {
        try {
            let app = await App.create(req.body);
            res.json({
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
}
