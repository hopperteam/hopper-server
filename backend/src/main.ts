import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import Log from './log';
import bodyParser = require('body-parser');
import AuthMiddleware from './handler/authMiddleware';
import {Config} from "./config";
import * as mongoose from 'mongoose';

const log = new Log("HopperApp");

import GeneralHandler from './handler/generalHandler';
import SubscriptionHandler from './handler/subscriptionHandler';
import UserHandler from './handler/userHandler';
import SPHandler from './handler/spHandler';
import NotificationHandler from './handler/notificationHandler';

class HopperApp {

    private server: express.Application;

    constructor() {
        this.server = express();
        this.server.use(express.static("web", {'extensions': ['html']}));
        this.server.use(bodyParser.json());
        this.server.use(cookieParser());
    }

    private async loadConfig(): Promise<boolean> {
        try {
            if (!process.argv[2]) {
                log.info("Starting with local in memory DB");
                await Config.generateConfig();
            } else {
                log.info("Loading config from " + process.argv[2]);
                Config.parseConfig(process.argv[2]);
            }
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
                await mongoose.connect(`mongodb://${Config.instance.dbHost}:${Config.instance.dbPort}/${Config.instance.dbName}`, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                    user: Config.instance.dbUser,
                    pass: Config.instance.dbPassword
                });
            } catch (e) {
                log.error("Could not connect to DB (" + e.message + ")");
                return false;
            }

            setInterval(AuthMiddleware.daemon, 60000);

            this.server.use('/api/v1', new GeneralHandler().getRouter());
            this.server.use('/api/v1', new SPHandler().getRouter());

            this.server.use(AuthMiddleware.auth());
            this.server.use('/api/v1', new SubscriptionHandler().getRouter());
            this.server.use('/api/v1', new UserHandler().getRouter());
            this.server.use('/api/v1', new NotificationHandler().getRouter());
        }

        return true;
    }

    public async start(): Promise<void> {
        if (!(await this.loadConfig() && await this.init())) {
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
