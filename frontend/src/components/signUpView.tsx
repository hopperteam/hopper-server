import * as React from 'react';
import {ChangeEvent, FormEvent} from "react";
import {IHopperApi} from "../api/hopperApi";

type SignUpViewProps = {
    onLoggedIn: () => void,
    api: IHopperApi
}

type SignUpViewState = {
    working: boolean,
    email: string,
    password: string,
    repeatedPassword: string,
    firstName: string,
    lastName: string,
    error: string
}

export default class SignUpView extends React.Component<SignUpViewProps, SignUpViewState> {

    constructor(props: Readonly<SignUpViewProps>) {
        super(props);

        this.state = {
            working: false,
            email: "",
            password: "",
            repeatedPassword: "",
            firstName: "",
            lastName: "",
            error:  "",
        }
    }

    private onSignUp(evt: FormEvent<HTMLFormElement>): boolean {
        evt.preventDefault();
        console.log(this.state);
        if (this.state.password != this.state.repeatedPassword) {
            console.log("no");
            (document.getElementById("repeatedPassword") as HTMLInputElement).setCustomValidity("Passwords do not match!");
            return false;
        }

        this.setState({working: true});
        this.signUp().then(() => this.setState({working: false}));
        return false;
    }

    private async signUp() {
        let res = await this.props.api.register(this.state.email, this.state.password, this.state.firstName, this.state.lastName);
        if (res[0]) {
            this.props.onLoggedIn();
            return;
        }
        this.setState({
            error: res[1]
        });
    }

    render(): React.ReactNode {
        return <div id="loginView">
            <form onSubmit={this.onSignUp.bind(this)} target={"#"}>
                { this.state.error != "" && <span id="error">{this.state.error}</span> }
                <input name="email" required placeholder="E-Mail" type="email" onChange={(evt) => this.setState({ email: evt.target.value})} value={this.state.email} disabled={this.state.working} /> <br />
                <input name="password" required placeholder="Password" type="password" onChange={(evt) => this.setState({ password: evt.target.value})} value={this.state.password} disabled={this.state.working} /> <br />
                <input id="repeatedPassword" required name="repeatedPassword" placeholder="Repeat Password" type="password" onChange={(evt) => this.setState({ repeatedPassword: evt.target.value})} value={this.state.repeatedPassword} disabled={this.state.working} />
                { this.state.password != this.state.repeatedPassword && <span id="passwordsDoNotMatch">Passwords have to match!</span> } <br />
                <input name="fName" required placeholder="First Name" type="text" onChange={(evt) => this.setState({ firstName: evt.target.value})} value={this.state.firstName} disabled={this.state.working} /> <br />
                <input name="lName" required placeholder="Last Name" type="text" onChange={(evt) => this.setState({ lastName: evt.target.value})} value={this.state.lastName} disabled={this.state.working} /> <br />
                <input type="submit" value="Sign Up" id="loginButton" disabled={this.state.working} />
            </form>
        </div>;
    }
}
