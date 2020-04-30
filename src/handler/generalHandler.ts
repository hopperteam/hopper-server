import * as express from 'express';
import Handler from './handler';;
import Log from '../log';
import * as utils from '../utils';
import { Config } from "../config";

const log: Log = new Log("GeneralHandler");

export default class GeneralHandler extends Handler {

    constructor() {
        super();
        this.router.get("/", this.ping.bind(this));
        this.router.post("/forgetPassword", this.forgetPassword.bind(this));
    }

    private async ping(req: express.Request, res: express.Response): Promise<void> {
        log.info("Pinged by a user");
        res.json({
            "version": Config.HOPPER_VERSION,
            "type": Config.HOPPER_VERSION_TYPE
        });
    }

    private async forgetPassword(req: express.Request, res: express.Response): Promise<void> {
        if (!req.body.email) {
            utils.handleError(new Error("Email not provided"), log, res);
            return;
        }
        // send out email with a link to change the password
        res.json({
            "status": "success"
        });
    }
}
