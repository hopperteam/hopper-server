import * as express from 'express';
import Handler from './handler';
import User from '../types/user'
import Session from '../types/session';
import Log from '../log';
import * as utils from '../utils';
import { Config } from "../config";

const log: Log = new Log("GeneralHandler");

export default class GeneralHandler extends Handler {

    constructor() {
        super();
        this.router.get("/", this.ping.bind(this));
        this.router.post("/login", this.login.bind(this));
        this.router.post("/register", this.register.bind(this));
        this.router.post("/forgetPassword", this.forgetPassword.bind(this));
    }

    private async ping(req: express.Request, res: express.Response): Promise<void> {
        log.info("Pinged by a user");
        res.json({
            "version": Config.HOPPER_VERSION,
            "type": Config.HOPPER_VERSION_TYPE
        });
    }

    private async login(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = await User.findOne({ email: req.body.email, password: utils.hashPassword(req.body.password) });
            if (!user)
                throw new Error("Invalid login data");
            const session = Session.create(user._id);
            res.json({
                "status": "success",
                "token": session.id
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
    }

    private async register(req: express.Request, res: express.Response): Promise<void> {
        try {
            if (await User.findOne({ email: req.body.email }))
                throw new Error("Email is already in use");
            req.body.password = utils.hashPassword(req.body.password);
            const user = await User.create(req.body);
            const session = await Session.create(user._id);
            res.json({
                "status": "success",
                "token": session.id
            });
        } catch (e) {
            utils.handleError(e, log, res);
        }
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
