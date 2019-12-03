export type User = {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
}

export type Notification = {
    readonly id: string;
    readonly heading: string;
    readonly subscription: string;
    readonly timestamp: number;
    readonly imageUrl: string | undefined;
    isDone: boolean;
    readonly isSilent: boolean;
    readonly type: string;
    readonly content: any;
    readonly actions: Action[];
}

export type Action = {
    readonly type: string;
    readonly url: string;
    readonly markAsDone: boolean;
    readonly text: string;
}

export type App = {
    readonly id: string;
    readonly name: string;
    readonly imageUrl: string;
    readonly isActive: boolean;
    readonly isHidden: boolean;
    readonly baseUrl: string;
    readonly manageUrl: string;
}

export type SubscribeRequest = {
    readonly id: string;
    readonly callback: string;
    readonly accountName: string;
    readonly requestedInfos: string[];
}

export type Subscription = {
    readonly id: string;
    readonly accountName?: string;
    readonly app: App;
}
