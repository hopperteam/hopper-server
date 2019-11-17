export type User = {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
}

export type Notification = {
    readonly id: string;
    readonly heading: string;
    readonly serviceProvider: string;
    readonly timestamp: number;
    readonly imageUrl: string | undefined;
    readonly isDone: boolean;
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
    readonly name: string;
    readonly requestedInfos: string[];
}
