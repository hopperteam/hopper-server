import * as React from 'react';
import {ChangeEvent, FormEvent} from "react";
import {IHopperApi} from "../api/hopperApi";
import {SubscribeRequest, User} from "../types";

type SubscribeViewProps = {
    onAccept: () => void,
    onDecline: () => void,
    user: User,
    request: SubscribeRequest
}

type SubscribeViewState = {
    working: boolean
}



export default class SubscribeView extends React.Component<SubscribeViewProps, SubscribeViewState> {

    constructor(props: Readonly<SubscribeViewProps>) {
        super(props);
        this.state = {
            working: false
        }
    }

    onAccept(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>): boolean {
        this.setState({ working: true });
        evt.preventDefault();
        this.props.onAccept();
        return false;
    }

    onDecline(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>): boolean {
        this.setState({ working: true });
        evt.preventDefault();
        this.props.onDecline();
        return false;
    }


    render(): React.ReactNode {
        return <div id="subscriptionView">
            <p>Subscribe to {this.props.request.id}</p>
            <p>Account: {this.props.request.name}</p>
            <button onClick={this.onAccept.bind(this)} disabled={this.state.working}>Accept</button>
            <button onClick={this.onDecline.bind(this)} disabled={this.state.working}>Decline</button>
        </div>;
    }
}
