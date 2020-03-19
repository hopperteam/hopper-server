import * as express from 'express';
import Session from '../types/session';
import * as utils from '../utils';

import Log from '../log';

const log = new Log("AuthMiddleware");

declare global {
    namespace Express {
        export interface Request {
            session: Session;
        }
    }
}

export default class AuthMiddleware {

    public static auth(): express.Handler {
        return async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            let sid = req.query.token || req.headers.authorization;
            try {
                if (sid == undefined) {
                    throw new Error("No session found");
                } 
                let session: Session | undefined;
                if (sid.startsWith("Bearer ")) {
                    session = Session.findById(sid.substr(7));
                } else {
                    session = Session.findById(sid);
                }
                
                if (!session)
                    throw new Error("No session found");
                req.session = session;
                next();
            } catch (e) {
                utils.handleError(e, log, res, 401);
            }
        }
    }

    public static daemon(): void {
        try {
            Session.deleteExpired();
        } catch (e) {
            log.error(e.message);
        }
    }
}
