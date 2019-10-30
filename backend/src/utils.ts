import * as express from 'express';
import * as crypto from 'crypto';

import Log from './log';

export function handleError(err: Error, log: Log, res: express.Response, statusCode: number = 400) {
    log.error(err.message);
    res.status(statusCode);
    res.json({
        "status": "error",
        "reason": err.message
    });
}

export function hashPassword(password: string, salt: string | undefined = undefined): any {
    const hash = crypto.createHash('sha256');
    if (!salt)
        salt = crypto.randomBytes(128).toString('base64');
    hash.update(salt);
    hash.update(password);
    return {
        password: hash.digest('hex'),
        salt: salt
    };
}

export function generateId(): string {
    const hash = crypto.createHash('sha256');
    hash.update(crypto.randomBytes(128).toString('base64'));
    return hash.digest('hex');
}
