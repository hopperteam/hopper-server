import * as React from 'react';
import {Notification} from 'types';

type CardProps = {
    notification: Notification
}

export default class NotificationView extends React.Component<CardProps> {
    render(): React.ReactNode {
        return <div className="notification">
            <h1>{this.props.notification.heading}</h1>
        </div>
    }
}