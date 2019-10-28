import * as React from 'react';
import {NotificationIterator, NotificationSet} from 'notificationSet';
import {App, Notification} from "../types";

type NotificationContainerProps = {
    iterator: NotificationIterator,
    notifications: NotificationSet
}

type NotificationViewProps = {
    notification: Notification,
    sender: App
}

export default class NotificationContainer extends React.Component<NotificationContainerProps> {

    render(): React.ReactNode {
        this.props.iterator.reset();
        return <div id="notificationContainer" >
            {this.props.iterator.map(value => {
                return <NotificationView key={value.id} notification={value} sender={this.props.notifications.apps[value.serviceProvider]}/>
            })}
        </div>
    }
}

export class NotificationView extends React.Component<NotificationViewProps> {
    render(): React.ReactNode {
        return <div className="notification">
            <div className="notificationMeta">
                <span className="notificationSender">{this.props.sender.name}</span>
                <div className="notificationSenderSeparator" />
                <span className="notificationTime">5m ago</span>
            </div>
            <div className="notificationContent">
                <img className="notificationImage" alt="notificationImage" src={
                    this.props.notification.imageUrl != undefined ? this.props.notification.imageUrl : this.props.sender.imageUrl}
                />
                <p className="notificationTitle">{this.props.notification.heading}</p>
                <span className="notificationBody">{this.props.notification.content}</span>
            </div>
        </div>
    }
}
