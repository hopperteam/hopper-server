import * as express from 'express';

class MockSession {
    readonly SID: any;
    readonly USERID: string;
    readonly EXP_TS: number;
    readonly CUR_TS: number;

    constructor(sid: any, userId: string, expTs: number, curTs: number) {
        this.SID = sid;
        this.USERID = userId;
        this.EXP_TS = expTs;
        this.CUR_TS = curTs;
    }
}

const mockSessions: MockSession[] = [
    new MockSession(
        1234,
        "0",
        15,
        13
    ),
    new MockSession(
        1235,
        "1",
        15,
        17
    )
];

async function mockDbAccess(sid: any): Promise <MockSession[] > {
    return new Promise<MockSession[]>((resolve) => {
        setTimeout(() => {
            resolve(mockSessions.filter((session: MockSession) => session.SID == sid));
        }, 200);
    });
}

class Session {
    readonly userId: string;
    constructor(userId: string) {
        this.userId = userId;
    }
}

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
            let sid = req.cookies.sid;
            if (sid == null) {
                res.status(401);
                res.json({
                    "status": "error",
                    "reason": "unauthorized"
                });
                return;
            }
            // access database and determine if valid session
            //for now:
            let sessions: Array<MockSession> = await mockDbAccess(sid);
            if (sessions.length == 1 && sessions[0].EXP_TS > sessions[0].CUR_TS) {
                req.session = new Session(sessions[0].USERID);
                next();
            } else {
                res.status(401);
                res.json({
                    "status": "error",
                    "reason": "unauthorized"
                });
            }
        }
    }
}
