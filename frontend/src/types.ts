export class User {
    readonly name: string;
    readonly email: string;


    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}

export class Notification {
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


    constructor(id: string, heading: string, serviceProvider: string, timestamp: number, imageUrl: string | undefined, isDone: boolean, isSilent: boolean, type: string, content: any, actions: Action[]) {
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
}

export class Action {
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
}

export class App {
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
}