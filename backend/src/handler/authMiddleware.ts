import * as express from 'express';
import Session from '../types/session';

class SessionPlaceholder {
    readonly userId: string;
    constructor(userId: string) {
        this.userId = userId;
    }
}

declare global {
    namespace Express {
        export interface Request {
            session: SessionPlaceholder;
        }
    }
}

export default class AuthMiddleware {

    public static auth(): express.Handler {
        return async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            let sid = req.cookies.sid;
            if (sid == null) {
                res.status(401);
                res.json({
                    "status": "error",
                    "reason": "unauthorized"
                });
                return;
            }
            try {
                const session = await Session.findById(sid);
                if (!session)
                    throw new Error("No session found");
                req.session = new SessionPlaceholder(session.userId);
                next();
            } catch (e) {
                res.status(401);
                res.json({
                    "status": "error",
                    "reason": "unauthorized " + e.message
                });
            }
        }
    }
}
