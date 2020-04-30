import * as express from 'express';
import Session from '../types/session';
import * as utils from '../utils';

import Log from '../log';
import { Config } from '../config';

const log = new Log("AuthMiddleware");

declare global {
    namespace Express {
        export interface Request {
            session: Session;
        }
    }
}

export default class AuthMiddleware {

    public static auth(permissionName: string): express.Handler {
        const namespacedPermission = Config.instance.permissionNamespace + "." + permissionName;
        return async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            let sid = req.query.token || req.headers.authorization;
            try {
                if (sid == undefined) {
                    throw new Error("No session found");
                } 
                let session: Session | undefined;
                if (sid.startsWith("Bearer ")) {
                    session = await Session.decode(sid.substr(7));
                } else {
                    session = await Session.decode(sid);
                }
                
                if (!session)
                    throw new Error("No session found");

                if (!session.user.roles.includes(namespacedPermission)) {
                    utils.handleError(new Error("No permission to use this service"), log, res, 403);
                    return
                }
                
                req.session = session;
                next();
            } catch (e) {
                utils.handleError(e, log, res, 401);
            }
        }
    }
}
