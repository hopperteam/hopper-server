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

    protected async sendRequest(url: string, method: string, body?: string): Promise<XMLHttpRequest> {
        return new Promise<XMLHttpRequest>(resolve => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, this.apiRoot + url, true);
            xhr.onload = () => resolve(xhr);
            xhr.send(body);
        });
    }

    protected get(url: string, fields: { [index: string]: (string|number|boolean) } = {}): Promise<XMLHttpRequest> {
        return this.sendRequest(RestfulApi.buildUrl(url, fields), "GET", undefined);
    }

    protected delete(url: string, fields: { [index: string]: (string|number|boolean) } = {}): Promise<XMLHttpRequest> {
        return this.sendRequest(RestfulApi.buildUrl(url, fields), "DELETE", undefined);
    }

    protected post(url: string, body: any): Promise<XMLHttpRequest> {
        return this.sendRequest(url, "POST", JSON.stringify(body));
    }

    protected put(url: string, body: any): Promise<XMLHttpRequest> {
        return this.sendRequest(url, "PUT", JSON.stringify(body));
    }
}


