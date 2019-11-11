export type ApiCallResult = {
    status: number,
    resultParsable: boolean,
    result: any
}

export default abstract class RestfulApi {
    public static buildUrl(url: string, fields: { [index: string]: (string|number|boolean) }): string {
        let first = true;
        for (let x in fields) {
            url += ((first) ? "?" : "&") + x + encodeURIComponent(fields[x]);
            first = false;
        }
        return url;
    }

    protected readonly apiRoot: string = "/";

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
            xhr.send(body);
        });
    }

    protected get(url: string, fields: { [index: string]: (string|number|boolean) } = {}): Promise<ApiCallResult> {
        return this.sendRequest(RestfulApi.buildUrl(url, fields), "GET", undefined);
    }

    protected delete(url: string, fields: { [index: string]: (string|number|boolean) } = {}): Promise<ApiCallResult> {
        return this.sendRequest(RestfulApi.buildUrl(url, fields), "DELETE", undefined);
    }

    protected post(url: string, body: any): Promise<ApiCallResult> {
        return this.sendRequest(url, "POST", JSON.stringify(body));
    }

    protected put(url: string, body: any): Promise<ApiCallResult> {
        return this.sendRequest(url, "PUT", JSON.stringify(body));
    }
}


