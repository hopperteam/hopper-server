export class Notification {
    readonly id: number;
    readonly sender: App;
    readonly heading: string;
    readonly body: string;


    constructor(id: number, sender: App, heading: string, body: string) {
        this.id = id;
        this.sender = sender;
        this.heading = heading;
        this.body = body;
    }
}

export class App {
    readonly id: number;
    readonly name: string;


    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class User {
    readonly name: string;
    readonly email: string;


    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}
