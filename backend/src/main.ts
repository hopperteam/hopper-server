import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import Log from './log';
import bodyParser = require('body-parser');
import AuthMiddleware from './handler/authMiddleware';
const config = require('./config.json');
import * as mongoose from 'mongoose';

const log = new Log("App");

import GeneralHandler from './handler/generalHandler';
import AppHandler from './handler/appHandler';
import UserHandler from './handler/userHandler';
import NotificationHandler from './handler/notificationHandler';

const LOCAL: boolean = false;

class ExpressApp {

    private server: express.Application;

    constructor() {
        this.server = express();
        this.server.use(express.static("web", {'extensions': ['html']}));
        this.server.use(bodyParser.json());
        this.server.use(cookieParser());
    }

    private async init(): Promise<boolean> {
        if (LOCAL) {
            try {
                await mongoose.connect(config.localDbPath, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
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
            this.server.use('/api/v1', new NotificationHandler().getRouter());
        }

        return true;
    }

    public async start(): Promise<void> {
        this.init().then((success) => {
            if (!success) {
                log.error("Could not initalize app");
                return;
            }
            this.server.listen(config.port, () => {
                log.info("Server listening on port: " + config.port);
            });
        });
    }
}

const app = new ExpressApp();
app.start();
