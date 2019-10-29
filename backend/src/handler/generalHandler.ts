import * as express from 'express';
import Handler from './handler';
import User from '../types/user'
import Log from '../log';
const config = require('../config');

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
            "version": config.version,
            "type": config.type
        });
    }

    private async login(req: express.Request, res: express.Response): Promise<void> {
        if (req.body.email == null || req.body.password == null) {
            log.error("Login attempt failed (insufficiant login data)");
            res.status(400);
            res.json({
                "status": "error",
                "reason": "Please provide an email and a password"
            });
            return;
        }
        // determine if valid login data and provide session/cookie stuff
        res.json({
            "status": "success"
        });
    }

    private async register(req: express.Request, res: express.Response): Promise<void> {
        try {
            var user: User = User.fromRequestJson(req.body);
        } catch (e) {
            log.error("Register attempt failed (could not create user)");
            res.status(400);
            res.json({
                "status": "error",
                "reason": e.message
            });
            return;
        }
        // add user to the database and provide session/cookie stuff
        res.json({
            "status": "success"
        });
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
