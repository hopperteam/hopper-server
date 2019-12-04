import * as React from 'react';
import {User} from "../types";

type TopMessageProps = {
    text: string,
    buttonText: string,
    onButtonClick: () => void
    onClose: () => void
}

export default class TopMessage extends React.Component<TopMessageProps> {

    render(): React.ReactNode {
        return <div className="topMessage">
            <span>{this.props.text}</span>
            <button onClick={this.props.onButtonClick}>{this.props.buttonText}</button>
            <button onClick={this.props.onClose}>X</button>
        </div>
    }
}
