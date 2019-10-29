
export default class User {
    readonly id: string|undefined;
    readonly email: string;
    readonly password: string|undefined;
    readonly firstName: string;
    readonly lastName: string;

    constructor(id: string|undefined, email: string, password: string|undefined, firstName: string, lastName: string) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public static fromRequestJson(json: any): User {
        if (json.email == null || json.password == null || json.firstName == null || json.lastName == null) {
            throw new Error("Required attributes for User missing");
        }
        return new User(
            undefined,
            json.email,
            json.password,
            json.firstName,
            json.lastName
        );
    }

    public static fromDbJson(json: any): User {
        return new User(
            json.id,
            json.email,
            undefined,
            json.firstName,
            json.lastName
        );
    }
}