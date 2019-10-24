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
            <div className="notificationMeta">
                <span className="notificationSender">{this.props.notification.sender.name}</span>
                <div className="notificationSenderSeperator" />
                <span className="notificationTime">5m ago</span>
            </div>
            <div className="notificationContent">
                <img className="notificationImage" alt="notificationImage" src={
                    this.props.notification.imageLink != undefined ? this.props.notification.imageLink : this.props.notification.sender.imageLink}
                />
                <p className="notificationTitle">{this.props.notification.heading}</p>
                <span className="notificationBody">{this.props.notification.body}</span>
            </div>
        </div>
    }
}
