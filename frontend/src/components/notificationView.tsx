import * as React from 'react';
import {Notification, NotificationIterator} from 'notification';

type NotificationContainerProps = {
    iterator: NotificationIterator
}

type NotificationViewProps = {
    notification: Notification
}

export default class NotificationContainer extends React.Component<NotificationContainerProps> {

    render(): React.ReactNode {
        this.props.iterator.reset();
        return <div id="notificationContainer" >
            {this.props.iterator.map(value => {
                return <NotificationView key={value.id} notification={value} />
            })}
        </div>
    }
}

export class NotificationView extends React.Component<NotificationViewProps> {
    render(): React.ReactNode {
        return <div className="notification">
            <h2>{this.props.notification.heading}</h2>
            <span>{this.props.notification.sender.name}</span>
            <span> - </span>
            <span>{this.props.notification.body}</span>
        </div>
    }
}
