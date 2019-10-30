import * as utils from '../utils';

var sessions: Map<string, Session> = new Map<string, Session>();

export default class Session {
    readonly id: string;
    readonly userId: string;
    private readonly expTs: number;
    static MAX_AGE: number = 86400000; // 24h in ms

    constructor(userId: string) {
        this.id = utils.generateId();
        this.userId = userId;
        this.expTs = Date.now() + Session.MAX_AGE;
    }

    public static create(userId: string) {
        let session = new Session(userId);
        sessions.set(session.id, session);
        return session;
    }

    public static findById(id: string): Session | undefined {
        return sessions.get(id);
    }

    public static deleteExpired(): void {
        let ts: number = Date.now();
        sessions.forEach((session: Session) => {
            if (session.expTs < ts)
                sessions.delete(session.id);
        });
    }

    public static deleteAssociated(userId: string): void {
        sessions.forEach((session: Session) => {
            if (session.userId == userId)
                sessions.delete(session.id);
        });
    }
}
