import 'jest';
import * as crypto from 'crypto';
import * as utils from '../src/utils';

describe('utils ', () => {

    it('should decrypt content', () => {
        try {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                    passphrase: "password"
                }
            });
            const json = {
                "name": "ModernApp",
                "baseUrl": "www.baseurl.com",
                "imageUrl": "https://www.baseurl.com/path/to/bild.png",
                "contactEmail": "support@ModernApp.com"
            };
            let sha = crypto.createHash('sha256');
            sha.update(JSON.stringify(json));
            let jsonHash = sha.digest("hex");
            let hash = crypto.privateEncrypt({ key: privateKey, passphrase: "password" }, Buffer.from(jsonHash));
            let obj = { "verify": hash.toString("base64"), "data": json };
            let result = utils.decryptContent(Buffer.from(publicKey).toString("base64"), Buffer.from(JSON.stringify(obj)).toString("base64"));
            expect(result).toEqual(json);
        } catch (e) {
            expect("").toBe(e.message);
        }
    });

    it('should generate a id', () => {
        let regex = /([0-9a-z]){64}/;
        try {
            let id = utils.generateId();
            expect(id).toMatch(regex);
        } catch (e) {
            expect("").toBe(e.message);
        }
    });

    it('should hash a password', () => {
        let regex = /([0-9a-z]){64}/;
        let password = "strongPassword";
        try {
            let hash = utils.hashPassword(password);
            expect(hash).toMatch(regex);
        } catch (e) {
            expect("").toBe(e.message);
        }
    });

});
