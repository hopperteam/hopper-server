import 'jest';
import * as crypto from 'crypto';
import * as utils from '../src/utils';
import * as jwt from 'jsonwebtoken';

describe('utils ', () => {

    it('should decrypt content', async () => {
        try {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                }
            });
            const json = {
                "name": "ModernApp",
                "baseUrl": "www.baseurl.com",
                "imageUrl": "https://www.baseurl.com/path/to/bild.png",
                "contactEmail": "support@ModernApp.com"
            };
            let token = jwt.sign(json, privateKey, {algorithm: 'RS256'});
            let result = await utils.decryptContent(new Buffer(publicKey).toString('base64'), token);
            delete result['iat']; 
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


});

