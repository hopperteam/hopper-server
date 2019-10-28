import Action from './action';

export default class Notification {
    readonly id: string | undefined;
    readonly heading: string;
    readonly serviceProvider: string;
    readonly timestamp: number;
    readonly imageUrl: string | undefined;
    readonly isDone: boolean;
    readonly isSilent: boolean;
    readonly type: string;
    readonly content: any;
    readonly actions: Action[];


    constructor(id: string|undefined, heading: string, serviceProvider: string, timestamp: number, imageUrl: string | undefined, isDone: boolean, isSilent: boolean, type: string, content: any, actions: Action[]) {
        this.id = id;
        this.heading = heading;
        this.serviceProvider = serviceProvider;
        this.timestamp = timestamp;
        this.imageUrl = imageUrl;
        this.isDone = isDone;
        this.isSilent = isSilent;
        this.type = type;
        this.content = content;
        this.actions = actions;
    }

    public static fromRequestJson(json: any): Notification {
        if (json.heading == null || json.serviceProvider == null || json.timestamp == null || json.isSilent == null || json.type == null || json.content == null || json.actions == null) {
            throw new Error("Required attributes for Notification missing");
        }
        let actions: Array<Action> = [];
        try {
            json.actions.foreach((action: any) => {
                actions.push(Action.fromRequestJson(action));
            });
        } catch (e) {
            throw new Error(e);
        }
        return new Notification(
            undefined,
            json.heading,
            json.serviceProvider,
            json.timestamp,
            json.imageUrl,
            false,
            json.isSilent,
            json.type,
            json.content,
            actions
        );
    }

    public static fromDbJson(json: any): Notification {
        return new Notification(
            json.id,
            json.heading,
            json.serviceProvider,
            json.timestamp,
            json.imageUrl,
            json.isDone,
            json.isSilent,
            json.type,
            json.content,
            json.actions
        );
    }
}