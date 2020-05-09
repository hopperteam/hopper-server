import { isUrl } from "../utils";

export default class SubscribeRequest {
    readonly id: string;
    readonly callback: string;
    readonly accountName: string | undefined;
    readonly requestedInfos: string[];

    constructor(id: string, callback: string, accountName: string, requestedInfos: string[]) {
        this.id = id;
        this.callback = callback;
        this.accountName = accountName;
        this.requestedInfos = requestedInfos;
    }

    public static fromRequestBody(json: any): SubscribeRequest {
        if (json.id == null || json.callback == null || json.requestedInfos == null) {
            throw new Error("Required attributes for SubscribeRequest missing");
        }
        if (!isUrl(json.callback))
            throw new Error("Callback is not a valid URL");

        return new SubscribeRequest(
            json.id,
            json.callback,
            json.accountName,
            json.requestedInfos
        );
    }
}