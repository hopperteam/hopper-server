import {App, Notification, SubscribeRequest, Subscription, User} from "types";
import ApiBase from "api/restfulApi";

export interface IHopperApi {
    login(email: string, password: string): Promise<boolean>
    register(email: string, password: string, firstName: string, lastName: string): Promise<[boolean, string]>
    getCurrentUser(): Promise<User|undefined>

    getSubscriptions(): Promise<Subscription[]>
    getNotifications(includeDone: boolean, subscription: string|undefined, offset: number, limit: number): Promise<Notification[]>
    getSubscribeRequest(data: string, appId: string): Promise<SubscribeRequest|undefined>
    postSubscribeRequest(data: string, appId: string): Promise<string|undefined>
    markNotificationAsDone(notificationId: string): Promise<boolean>
    markNotificationAsUndone(notificationId: string): Promise<boolean>
    getApp(appId: string): Promise<App|undefined>
    deleteNotification(notificationId: string): Promise<boolean>
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

    async register(email: string, password: string, firstName: string, lastName: string): Promise<[boolean, string]> {
        let res = await this.post("/register", {
            "email": email,
            "password": password,
            "firstName": firstName,
            "lastName": lastName
        });

        let success =  res.status == 200 && res.result.status == "success";
        let error = "";
        if (!success && res.resultParsable) {
            error = res.result.reason;
        }
        return [success, error]
    }

    async getCurrentUser(): Promise<User|undefined> {
        let resp = await this.get("/user");
        if (resp.status != 200) return undefined;
        return resp.result;
    }

    async getSubscriptions(): Promise<Subscription[]> {
        let resp = await this.get("/subscriptions");
        if (resp.status != 200) return [];
        return resp.result;
    }

    async getNotifications(includeDone: boolean, subscription: string | undefined, offset: number, limit: number): Promise<Notification[]> {
        let resp = await this.get("/notifications", {
            includeDone: includeDone,
            subscription: subscription,
            skip: offset,
            limit: limit
        });
        if (resp.status != 200) return [];
        return resp.result;
    }

    async getSubscribeRequest(content: string, appId: string): Promise<SubscribeRequest|undefined> {
        let resp = await this.get("/subscribeRequest", {
            content: content,
            id: appId
        });
        if (resp.status != 200) return undefined;
        return resp.result.subscribeRequest;
    }

    async postSubscribeRequest(content: string, appId: string): Promise<string|undefined> {
        let resp = await this.post("/subscribeRequest", {
            content: content,
            id: appId
        });
        if (resp.status != 200) return undefined;
        return resp.result.subscriptionId;
    }

    async markNotificationAsDone(notificationId: string): Promise<boolean> {
        let resp = await this.post("/notifications/done", {
            id: notificationId
        });
        return resp.status == 200;
    }

    async markNotificationAsUndone(notificationId: string): Promise<boolean> {
        let resp = await this.post("/notifications/undone", {
            id: notificationId
        });
        return resp.status == 200;
    }

    async getApp(appId: string): Promise<App|undefined> {
        let resp = await this.get("/apps", {
            id: appId
        });
        if (resp.status != 200) return undefined;
        return resp.result;
    }

    async deleteNotification(notificationId: string): Promise<boolean> {
        let resp = await this.delete("/notifications", {
            id: notificationId
        });
        return resp.status == 200;
    }
}
