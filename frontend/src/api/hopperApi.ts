import {App, Notification, User} from "types";
import ApiBase from "api/restfulApi";

export interface IHopperApi {
    login(email: string, password: string): Promise<boolean>
    getCurrentUser(): Promise<User|undefined>
    getApps(): Promise<App[]>
    getNotifications(includeDone: boolean, app: string|undefined, offset: number, limit: number): Promise<Notification[]>
}

export class HopperApi extends ApiBase implements IHopperApi {
    constructor(apiPath: string = "/api/v1") {
        super(apiPath);
    }

    async login(email: string, password: string): Promise<boolean> {
        let res = await this.post("/login", {
            "email": email,
            "password": password
        });

        return res.status == 200 && res.result.status == "success";
    }

    async getCurrentUser(): Promise<User|undefined> {
        let resp = await this.get("/user");
        if (resp.status != 200) return undefined;
        return resp.result;
    }

    async getApps(): Promise<App[]> {
        let resp = await this.get("/apps");
        if (resp.status != 200) return [];
        return resp.result;
    }

    async getNotifications(includeDone: boolean, app: string | undefined, offset: number, limit: number): Promise<Notification[]> {
        let resp = await this.get("/notifications", {
            includeDone: includeDone,
            app: app,
            skip: offset,
            limit: limit
        });
        if (resp.status != 200) return [];
        return resp.result;
    }
}