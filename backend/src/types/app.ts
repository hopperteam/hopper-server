
export default class App {
    readonly id: string | undefined;
    readonly name: string;
    readonly imageUrl: string;
    public isActive: boolean;
    readonly isHidden: boolean;
    readonly baseUrl: string;
    readonly manageUrl: string;


    constructor(id: string|undefined, name: string, imageUrl: string, isActive: boolean, isHidden: boolean, baseUrl: string, manageUrl: string) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.isActive = isActive;
        this.isHidden = isHidden;
        this.baseUrl = baseUrl;
        this.manageUrl = manageUrl;
    }

    public static fromRequestJson(json: any): App {
        if (json.name == null || json.imageUrl == null || json.baseUrl == null || json.manageUrl == null) {
            throw new Error("Required attributes for App missing");
        }
        // todo base url checking, possibly replace default bools with parameters
        return new App(
            undefined,
            json.name,
            json.imageUrl,
            true,
            false,
            json.baseUrl,
            json.manageUrl
        );
    }

    public static fromDbJson(json: any): App {
        return new App(
            json.id,
            json.name,
            json.imageUrl,
            json.isActive,
            json.isHidden,
            json.baseUrl,
            json.manageUrl
        );
    }
}
