import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import Log from './log';
import bodyParser = require('body-parser');
import AuthMiddleware from './handler/authMiddleware';
import {Config} from "./config";
import * as mongoose from 'mongoose';

const log = new Log("HopperApp");

import GeneralHandler from './handler/generalHandler';
import AppHandler from './handler/appHandler';
import UserHandler from './handler/userHandler';
//import NotificationHandler from './handler/notificationHandler';

class HopperApp {

    private server: express.Application;

    constructor() {
        this.server = express();
        this.server.use(express.static("web", {'extensions': ['html']}));
        this.server.use(bodyParser.json());
        this.server.use(cookieParser());
    }

    private loadConfig(): boolean {
        if (process.argv.length <= 2) {
            log.error("Specify config to load!");
            return false;
        }

        log.info("Loading config from " + process.argv[2]);
        try {
            Config.initConfig(process.argv[2]);
        } catch (e) {
            log.error("Could not start: " + e.toString());
            return false;
        }

        return true;
    }

    private async init(): Promise<boolean> {

        if (Config.instance.startBackend) {
            log.info("Starting backend");
            try {
                await mongoose.connect(`mongodb://${Config.instance.dbHost}/${Config.instance.dbName}`, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    user: Config.instance.dbUser,
                    pass: Config.instance.dbPassword
                });
            } catch (e) {
                log.error("Could not connect to DB (" + e.message + ")");
                return false;
            }

            setInterval(AuthMiddleware.daemon, 60000);

            this.server.use('/api/v1', new GeneralHandler().getRouter());

            this.server.use(AuthMiddleware.auth());
            this.server.use('/api/v1', new AppHandler().getRouter());
            this.server.use('/api/v1', new UserHandler().getRouter());
            //this.server.use('/api/v1', new NotificationHandler().getRouter());
        }

        return true;
    }

    public async start(): Promise<void> {
        if (!(this.loadConfig() && await this.init())) {
            log.error("Could not initalize app");
            return;
        }

        this.server.listen(Config.instance.port, () => {
            log.info("Server listening on port: " + Config.instance.port);
        });
    }
}

const app = new HopperApp();
app.start();
