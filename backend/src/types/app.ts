
export default class App {
    readonly id: string;
    readonly name: string;
    readonly imageUrl: string;
    readonly isActive: boolean;
    readonly isHidden: boolean;
    readonly baseUrl: string;
    readonly manageUrl: string;


    constructor(id: string, name: string, imageUrl: string, isActive: boolean, isHidden: boolean, baseUrl: string, manageUrl: string) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.isActive = isActive;
        this.isHidden = isHidden;
        this.baseUrl = baseUrl;
        this.manageUrl = manageUrl;
    }

    static fromDbJson(json: any): App {
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