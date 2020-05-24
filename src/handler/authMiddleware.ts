import * as express from 'express';
import Session, { SessionUser } from '../types/session';
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
            if (sid == undefined) {
                log.warn("No session found");
                utils.writeError("No session found", res, 401);
                return;
            } 

            let session: Session | undefined;
            if (sid.startsWith("Bearer ")) {
                session = await Session.decode(sid.substr(7));
            } else {
                session = await Session.decode(sid);
            }
            
            if (!session) {
                log.warn("No session found");
                utils.writeError("No session found", res, 401);
                return;
            }

            if (!session.user.roles.includes(namespacedPermission)) {
                log.warn("No permission to use this service");
                utils.writeError("No permission to use this service", res, 403);
                return
            }
            
            req.session = session;
            next();
        }
    }

    public static authMock(): express.Handler {
        return async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            let sessionUser: SessionUser = {
                id: "testUser",
                email: "testuser@hoppercloud.net",
                firstName: "Test",
                lastName: "User",
                roles: ["User"]
            };

            req.session = new Session("test", sessionUser);
            next();
        }
    }
}
