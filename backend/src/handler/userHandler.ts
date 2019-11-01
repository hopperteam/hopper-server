import * as express from 'express';
import Handler from './handler';
import User from '../types/user'
import Log from '../log';
import Session from '../types/session';
import * as utils from '../utils';

const log: Log = new Log("UserHandler");

export default class UserHandler extends Handler {

    constructor() {
        super();
        this.router.get("/user", this.getUser.bind(this));
        this.router.put("/user", this.putUser.bind(this));
        this.router.delete("/user", this.deleteUser.bind(this));
    }

    private async getUser(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = await User.findById({ _id: req.session.userId }, { _id: 0 });
            if (!user)
                throw new Error("User with a valid session does not exist, not good!");
            res.json(user);
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async putUser(req: express.Request, res: express.Response): Promise<void> {
        try {
            if (req.body.password)
                req.body.password = utils.hashPassword(req.body.password);
            await User.findByIdAndUpdate(req.session.userId, req.body);
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async deleteUser(req: express.Request, res: express.Response): Promise<void> {
        try {
            await User.findByIdAndDelete(req.session.userId);
            await Session.deleteAssociated(req.session.userId);
            // clean up more data that is associated with the user
            res.json({
                "status": "success"
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }
}
