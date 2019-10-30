import * as express from 'express';
import * as crypto from 'crypto';
import Handler from './handler';
import User from '../types/user'
import Session from '../types/session';
import Log from '../log';
import {Config} from "../config";

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
            const hash = crypto.createHash('sha256');
            const user = await User.findOne({ email: req.body.email });
            if (!user)
                throw new Error("No user found");
            hash.update(user.salt);
            hash.update(req.body.password);
            let password: string = hash.digest('hex');
            if (user.password != password)
                throw new Error("Wrong password");
            let ts = Math.round(Date.now() / 1000) + 86400; // session will expire in 24h
            const session = await Session.create({
                userId: user._id,
                expTs: ts
            });
            res.cookie("sid", session._id.toString(), { maxAge: 86400000 });
            res.json({
                "status": "success"
            });
        } catch (e) {
            log.error("Login attempt failed (" + e.message + ")");
            res.status(400);
            res.json({
                "status": "error",
                "reason": e.message
            });
        }
    }

    private async register(req: express.Request, res: express.Response): Promise<void> {
        try {
            if (await User.findOne({ email: req.body.email }))
                throw new Error("Email is already in use");
            const hash = crypto.createHash('sha256');
            const salt = crypto.randomBytes(128).toString('base64');
            hash.update(salt);
            hash.update(req.body.password);
            req.body.password = hash.digest('hex');
            req.body.salt = salt;
            const user = await User.create(req.body);
            let ts = Math.round(Date.now() / 1000) + 86400; // session will expire in 24h
            const session = await Session.create({
                userId: user._id,
                expTs: ts
            });
            res.cookie("sid", session._id.toString(), { maxAge: 86400000 });
            res.json({
                "status": "success"
            });
        } catch (e) {
            log.error("Register attempt failed (" + e.message + ")");
            res.status(400);
            res.json({
                "status": "error",
                "reason": e.message
            });
        }
    }

    private async forgetPassword(req: express.Request, res: express.Response): Promise<void> {
        if (req.body.email == null) {
            log.error("Reset attempt failed (insufficiant data)");
            res.status(400);
            res.json({
                "status": "error",
                "reason": "Please provide an email"
            });
            return;
        }
        // send out email with a link to change the password
        res.json({
            "status": "success"
        });
    }
}
