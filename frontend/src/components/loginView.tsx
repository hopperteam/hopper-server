import * as React from 'react';
import {ChangeEvent, FormEvent} from "react";
import HopperApi from "../api/restfulApi";

type LoginViewProps = {
    onLoggedIn: Function
}

type LoginViewState = {
    working: boolean,
    username: string,
    password: string,
    loginFailed: boolean
}

export default class LoginView extends React.Component<LoginViewProps, LoginViewState> {

    constructor(props: Readonly<LoginViewProps>) {
        super(props);

        this.state = {
            working: false,
            username: "",
            password: "",
            loginFailed: false
        }
    }

    onUsernameChange(evt: ChangeEvent<HTMLInputElement>) {
        this.setState({
            username: evt.target.value
        })
    }

    onPasswordChange(evt: ChangeEvent<HTMLInputElement>) {
        this.setState({
            password: evt.target.value
        })
    }

    onLogin(evt: FormEvent<HTMLFormElement>): boolean {
        this.setState({working: true});

        // TODO login

        evt.preventDefault();
        return false;
    }

    render(): React.ReactNode {
        return <div id="loginView">
            <form onSubmit={this.onLogin.bind(this)} target={"#"}>
                { this.state.loginFailed && <span id="loginFailed">Login failed!</span> }
                <input name="username" placeholder="username" type="text" onChange={this.onUsernameChange.bind(this)} value={this.state.username} disabled={this.state.working} />
                <input name="password" placeholder="password" type="password" onChange={this.onPasswordChange.bind(this)} value={this.state.password} disabled={this.state.working} />
                <input type="submit" value="Login" disabled={this.state.working} />
            </form>
        </div>;
    }
}
