import * as express from 'express';
import Handler from './handler';
import Log from '../log';
import Session from '../types/session';
import Notification from '../types/notification';
import Subscription from '../types/subscription';
import * as utils from '../utils';

const log: Log = new Log("UserHandler");

export default class UserHandler extends Handler {

    constructor() {
        super();
        this.router.get("/user", this.getUser.bind(this));
    }

    private async getUser(req: express.Request, res: express.Response): Promise<void> {
        res.json({
            "firstName": req.session.user.firstName,
            "lastName": req.session.user.lastName,
            "email": req.session.user.email
        });
        log.info("Got user information");
    }
}
