import * as express from 'express';
import * as crypto from 'crypto';
import validator from 'validator';

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

export function decryptContent(key: string, content: any): any {
    content = JSON.parse(Buffer.from(content, "base64").toString());

    let decryptedHash = crypto.publicDecrypt(Buffer.from(key, "base64"), Buffer.from(content.verify, "base64")).toString();
    const sha256 = crypto.createHash("sha256");
    sha256.update(JSON.stringify(content.data));
    let createdHash = sha256.digest("hex");
    if (decryptedHash != createdHash)
        throw new Error("Verification failed");

    return content.data;
}

// Validators
export function isUrl(url: string): boolean {
    return validator.isURL(url, {
        require_protocol: true,
        protocols: ['https', 'http']
    });
}
export function isEmail(email: string): boolean {
    return validator.isEmail(email);
}