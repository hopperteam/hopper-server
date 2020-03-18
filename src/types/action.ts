
export default class Action {
    readonly type: string;
    readonly url: string;
    readonly markAsDone: boolean;
    readonly text: string;


    constructor(type: string, url: string, markAsDone: boolean, text: string) {
        this.type = type;
        this.url = url;
        this.markAsDone = markAsDone;
        this.text = text;
    }

    public static fromRequestJson(json: any): Action {
        if (json.type == null || json.url == null || json.markAsDine == null || json.text == null) {
            throw new Error("Required attributes for Action missing");
        }
        return new Action(
            json.type,
            json.url,
            json.markAsDone,
            json.text
        );
    }

    public static fromDbJson(json: any): Action {
        return new Action(
            json.type,
            json.url,
            json.markAsDone,
            json.text
        );
    }
}