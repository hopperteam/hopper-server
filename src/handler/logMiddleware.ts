import * as express from 'express';

import Log from '../log';

const log = new Log("LogMiddleware");

export default class LogMiddleware {

    public static log(): express.Handler {
        return async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            log.info(`${req.method}: ${req.url}`);
            next();
        }
    }
}
