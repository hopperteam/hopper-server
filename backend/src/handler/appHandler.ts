import * as express from 'express';
import Handler from './handler';
import User from '../types/user';
import Log from '../log';
import * as utils from '../utils';

const log: Log = new Log("AppHandler");

export default class AppHandler extends Handler {
    
    constructor() {
        super();
        this.router.get("/apps", this.getApps.bind(this));
        this.router.delete("/apps", this.deleteApp.bind(this));
    }
    
    private async getApps(req: express.Request, res: express.Response): Promise<void> {
        try {
            let user = await User.findById(req.session.userId).populate('apps', { cert: 0 });
            if (!user)
                throw new Error("Cannot find user")
            res.json(user.apps);
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async deleteApp(req: express.Request, res: express.Response): Promise<void> {
        try {
            await User.findByIdAndUpdate(req.session.userId, { $pull: { apps: req.query.id } });
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }
}
