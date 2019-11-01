import * as express from 'express';
import * as crypto from 'crypto';

import Log from './log';

const SALT = "2346ad27d7568ba9896f1b7da6b5991251debdf2";

export function handleError(err: Error, log: Log, res: express.Response, statusCode: number = 400) {
    log.error(err.message);
    res.status(statusCode);
    res.json({
        "status": "error",
        "reason": err.message
    });
}

export function hashPassword(password: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(SALT);
    hash.update(password);
    return hash.digest('hex');
}

export function generateId(): string {
    const hash = crypto.createHash('sha256');
    hash.update(crypto.randomBytes(128).toString('base64'));
    return hash.digest('hex');
}
