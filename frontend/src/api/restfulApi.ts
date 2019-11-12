export type ApiCallResult = {
    status: number,
    resultParsable: boolean,
    result: any
}

export default abstract class RestfulApi {
    public static buildUrl(url: string, fields: { [index: string]: (string|number|boolean|undefined) }): string {
        let first = true;
        for (let x in fields) {
            let val = fields[x];
            if (val != undefined) {
                url += ((first) ? "?" : "&") + x + "=" + encodeURIComponent(val);
                first = false;
            }
        }
        return url;
    }

    readonly apiRoot: string = "";

    protected constructor(apiRoot: string) {
        this.apiRoot = apiRoot;
    }

    protected async sendRequest(url: string, method: string, body?: string): Promise<ApiCallResult> {
        return new Promise<ApiCallResult>(resolve => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, this.apiRoot + url, true);
            xhr.onload = () => {
                try {
                    resolve({
                        status: xhr.status,
                        resultParsable: true,
                        result: JSON.parse(xhr.responseText)
                    });
                } catch (e) {
                    resolve({
                        status: xhr.status,
                        resultParsable: false,
                        result: undefined
                    });
                }
            };
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(body);
        });
    }

    protected get(url: string, fields: { [index: string]: (string|number|boolean|undefined) } = {}): Promise<ApiCallResult> {
        return this.sendRequest(RestfulApi.buildUrl(url, fields), "GET", undefined);
    }

    protected delete(url: string, fields: { [index: string]: (string|number|boolean|undefined) } = {}): Promise<ApiCallResult> {
        return this.sendRequest(RestfulApi.buildUrl(url, fields), "DELETE", undefined);
    }

    protected post(url: string, body: any): Promise<ApiCallResult> {
        return this.sendRequest(url, "POST", JSON.stringify(body));
    }

    protected put(url: string, body: any): Promise<ApiCallResult> {
        return this.sendRequest(url, "PUT", JSON.stringify(body));
    }
}


