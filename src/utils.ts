import * as express from 'express';
import * as crypto from 'crypto';
import validator from 'validator';
import * as jwt from 'jsonwebtoken';
import Log from './log';

const logger = new Log("Utils");

export function handleError(err: Error, log: Log, res: express.Response, statusCode: number = 400) {
    log.error(err.message);
    writeError(err.message, res, statusCode);
}

export function writeError(reason: string, res: express.Response, code:number = 400) {
    res.status(code);
    res.json({
        "status": "error",
        "reason": reason
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
            if (err) {
                logger.error(err);
                res(undefined);
            }
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
