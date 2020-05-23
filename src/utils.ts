import * as express from 'express';
import * as crypto from 'crypto';
import validator from 'validator';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import Log from './log';

const logger = new Log("Utils");

export function writeDBError(err: mongoose.Error, res: express.Response) {
    let reason: string;
    let code: number = 400;
    if (err instanceof mongoose.Error.ValidationError) {
        let paths: string[] = [];
        Object.keys(err.errors).forEach((key: string, i: number) => {
            let error: mongoose.Error.ValidatorError | mongoose.Error.CastError = err.errors[key];
            if (error.kind === "required")
                paths.push(error.path + ": required");
            else if (error.kind === "user defined")
                paths.push(error.path + ": invalid data");
            else
                paths.push(error.path + ": invalid");
        });
        reason = paths.join(", ");
    } else if (err instanceof mongoose.Error.CastError) {
        reason = "Invalid id";
    } else {
        reason = "Internal Server Error";
        code = 500;
    }
    writeError(reason, res, code);
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
