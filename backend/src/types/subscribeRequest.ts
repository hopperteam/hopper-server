
export default class SubscribeRequest {
    readonly id: string;
    readonly callback: string;
    readonly name: string;
    readonly requestedInfos: string[];

    constructor(id: string, callback: string, name: string, requestedInfos: string[]) {
        this.id = id;
        this.callback = callback;
        this.name = name;
        this.requestedInfos = requestedInfos;
    }

    public static fromRequestBody(json: any): SubscribeRequest {
        if (json.id == null || json.callback == null || json.name == null || json.requestedInfos == null) {
            throw new Error("Required attributes for SubscribeRequest missing")
        }
        return new SubscribeRequest(
            json.id,
            json.callback,
            json.name,
            json.requestedInfos
        );
    }
}