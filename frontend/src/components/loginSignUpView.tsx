import * as React from 'react';
import {IHopperApi} from "../api/hopperApi";
import SignUpView from "./signUpView";
import LoginView from "./loginView";

type LoginSignUpViewProps = {
    onLoggedIn: () => void,
    api: IHopperApi
}

type LoginSingUpViewState = {
    onLoginScreen: boolean
}

export default class LoginSignUpView extends React.Component<LoginSignUpViewProps, LoginSingUpViewState> {

    constructor(props: Readonly<LoginSignUpViewProps>) {
        super(props);

        this.state = {
            onLoginScreen: true
        }
    }


    render(): React.ReactNode {
        return <div id="loginSignUpTabbedView">
            <div id="loginSignUpTabs">
                <button id="loginTab" onClick={ () => this.setState({onLoginScreen: true}) }>Login</button>
                <button id="signUpTab" onClick={ () => this.setState({onLoginScreen: false}) }>Sign Up</button>
            </div>
            {
                (this.state.onLoginScreen) ? <LoginView onLoggedIn={this.props.onLoggedIn} api={this.props.api} /> : <SignUpView onLoggedIn={this.props.onLoggedIn} api={this.props.api} />
            }
        </div>
    }
}
