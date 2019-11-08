import 'jest';
import * as utils from '../src/utils';

describe('utils ', () => {

    it('should decrypt content', () => {
        let content: any = {
            "id": "5dbd894cd4f2671be85edb2d",
            "name": "whatatravasty"
        };
        let cert: string = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUEwNGpLM2ozNllUM0pleG1Eb3hhWQplbEdENngxRjhZL3UzaHY2YVVSUGR3ZzRyR2hBOUxmTWR2bHUwdlk5L0F4a2VUczVQMmUvRVZuQ0h1WFJ2VUZMCk1UU1BBNEh4UHZFc0ZwQ0o0RjVIUmQxV2Q1blZXcEhYUjZNaGViSzRRbUF5YX d0aEswNWdlb293eUVucHRxSGEKL2thTlQ5cGZjQ2dkYjgvNWxRUjI2dWJFc2p6RTBmWkNpb2ZHMzVlS3pQM3NpRE0vQmplTUJCZzFlNUppeFYvSQpGWHB5UFVOWjlXaXpQNDJ0T1BTL1NFSFVPMmhSM2prNnNtalFvMksvTmROQ2NvQ3dZZlh2Z1pDSS9SZDdOaE5hCm5KN2FnaFd2ZlFSRlY4NHEydlBtWDdnS1F1dmtIL0JiVkl3TnJGekhad1Z0WkFvbnh5S3hCR FZtL0lXazV6R2UKR3hHdkM5T0VaeGZ5Ukc0TktYT0tNS1hqLzVZWHRNZ0x1NGpocHpiWVpPN2x3a0lkTVZCYjBXU0l0WW53VFV3VQo1QmZEOGtzVm5tSkJPQzQxRGFIM3dWM2ZhcERaek9uVXJYRDZOUTBVRXE0Sndpc2g3WVhEbkhlVnQ0b0dJaEFTCm91RTA2cXFRUlJTZzNJa0NlanoraFBwenhNa2YrSTRkVmQyVklJM3ZIbVl6UGowTHVuZHQ1NzVRMXdoTXBK WUkKSEsrSGdiWVYrNVZzYy8rbHUvazFuaTdUNTBjc2lyOTdEMGJvY2tJSVhTTnZYOWdmOFViMTlxSVdsU3NxWGdvRwp1ZjFBcXRwTlVtYkQrV21kWTc1ZCsvd0RDeENMd1Q3UWRWTng4MU9CbVRMdHlYM2lhaThOWUM2c0NPRFNJQ0FMCkpFdFdEdzM3Q2hlbldYMnYySUpBdXlFQ0F3RUFBUT09Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQo='";
        let data: string = "Am95DG5oLQL2z2sXCU90DWLk6jmIvRvhCaWhh5T2wSE4KOt7dwScmctZd7+R8y/EoqCrBwAoCZHNijfO3zU4DNrKGcbQD25Elc/0xaXpYPZq/nZqJCuFgBuWM2eCrL2zol3Ie8DPUDlkWY8lcgwGNIcHzbDHIAlNrMylKwwrWr7vUZ3fAlu0u+k/fOJpFZpiCM6vqXKMHfkRFAm4XpK73AMyZX8fkR3Knnua4cBfmZfXyWQRYZHXHIAjWAGNOpPh6ZTuQaO8KNkCDxRIRj/1bOoubFSVSBKV8kKLr49nhdMS+eYQcwCeeXtLwUns7ACYGkN1RuNdFiyja30fS09r/2oxJ9KREslGax2oshEaQrWN/Ng0hVLWQhsiY6TpkAYhwil3fVBLUdL0AqlQbECuBpiU6Ujwpnk2AfJpGRAV7QI8GYk88hDjHU7b1dPt1LddsLmF3VA6myyYBGK1GHbzZo1VrGGYfD0HYmK7AlMrtz1IfhAgjinE0cXDPZO8YeHKa3FxDeKlPwqzCVcOCqdfK+P2PNeAl5Q4UiKlLLZaLzja3eupgo4hv9fPXXXC49MbGIHeeV9I05XTx4dHaTDBO0Ci7mpVbm+VIp9pcioxpgJQi7IjkebOja460T1T76RKdYMxCj17Kr76MCQCXd4Lyr6jlS/RWt3qbzBMj8LeM7I=";
        let decryptedContent = utils.decryptContent(cert, data);
        expect(decryptedContent).toEqual(content);
    });

    it('should generate a id', () => {
        let regex = /([0-9a-z]){64}/;
        let id = utils.generateId();
        expect(id).toMatch(regex);
    });

    it('should hash a password', () => {
        let regex = /([0-9a-z]){64}/;
        let password = "strongPassword";
        let hash = utils.hashPassword(password);
        expect(hash).toMatch(regex);
    });

});
