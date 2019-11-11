import {App, Notification} from "types";
import ApiBase from "api/restfulApi";

export interface IHopperApi {
    login(email: string, password: string): Promise<boolean>;
    getApps(): Promise<App[]>
    getNotifications(includeDone: boolean, app: string|undefined, offset: number, limit: number): Promise<Notification[]>
}


class HopperApi extends ApiBase implements IHopperApi {
    async getApps(): Promise<App[]> {
        return [];
    }

    async getNotifications(includeDone: boolean, app: string | undefined, offset: number, limit: number): Promise<Notification[]> {
        return [];
    }

    async login(email: string, password: string): Promise<boolean> {
        let res = await this.post("login", {
            "email": email,
            "password": password
        });

        return res.status == 200 && res.result.status == "success";
    }

}