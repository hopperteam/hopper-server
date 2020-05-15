import * as express from 'express';
import * as crypto from 'crypto';
import validator from 'validator';
import * as jwt from 'jsonwebtoken';
import Log from './log';

const logger = new Log("Utils");

export function handleError(err: Error, log: Log, res: express.Response, statusCode: number = 400) {
    log.error(err.message);
    res.status(statusCode);
    res.json({
        "status": "error",
        "reason": err.message
    });
}

export function generateId(): string {
    const hash = crypto.createHash('sha256');
    hash.update(crypto.randomBytes(128).toString('base64'));
    return hash.digest('hex');
}

export async function decryptContent(key: string, content: any): Promise<any> {
    return new Promise((res) => {
        jwt.verify(content, Buffer.from(key, 'base64'), (err: any, decoded: any) => {
            if (err) res(undefined);
            logger.error(err);
            res(decoded);
        })
    });

}

// Validators
export function isUrl(url: string): boolean {
    return validator.isURL(url, {
        require_protocol: true,
        protocols: ['https', 'http'],
        require_tld: false
    });
}
export function isEmail(email: string): boolean {
    return validator.isEmail(email);
}
