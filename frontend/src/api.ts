const LOADING_TIME = 2000;

export default class HopperApi {
    static async login(username: string, password: string): Promise<HopperApi|null> {
        return new Promise<HopperApi|null>((resolve) => {
            console.log("## DUMMY API ##: login(" + username + ", " + password + ")");
            setTimeout(() => {
                if (username == "max" && password == "1234") {
                    resolve(new HopperApi("34n22"));
                } else {
                    resolve(null);
                }
            }, LOADING_TIME);
        });
    }

    private sessionId: string;

    constructor(sessionId: string) {
        this.sessionId = sessionId;
    }


}