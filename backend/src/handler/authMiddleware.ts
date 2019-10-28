import * as express from 'express';


export default class AuthMiddleware {

    public static auth(): express.Handler {
        return async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            let sid = req.cookies.sid;
            if (sid == null) {
                res.status(403);
                res.json({
                    "status": "error",
                    "reason": "unauthorized"
                });
                return;
            }
            // access database and determine if valid session, if valid session:
            next();
        }
    }
}
