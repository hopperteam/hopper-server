import * as jwt from 'jsonwebtoken';
import { Config } from '../config';

export default class Session {
    readonly id: string;
    readonly user: SessionUser;

    constructor(id: string, user: SessionUser) {
        this.id = id;
        this.user = user;
    }

    public async asJWT(): Promise<string> {
        return "";
    }

    public static async decode(session: string): Promise<Session | undefined> {
        return new Promise((res) => {
            jwt.verify(session, Config.instance.jwtCert, (err, decoded) => {
                if (err) res(undefined);
                let sessObj = decoded as SessionObject
                res(new Session(session, sessObj.user))
            });
        });

    }
}

type SessionObject = {
    user: SessionUser
}

export type SessionUser = {
    id: string
    firstName: string,
    lastName: string,
    email: string,
    roles: string[]
}
