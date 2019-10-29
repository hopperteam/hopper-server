import * as React from "react";
import {NotificationViewProps} from "./notificationContainer";

function getTimeText(date: number): string {
    let diff = Math.floor(Date.now() / 1000) - date;
    let future = diff < 0;
    diff = Math.abs(diff);

    if (diff < 60) {
        return (future) ? "In" + diff + "s" : diff + "s ago";
    }

    diff = Math.floor(diff / 60);
    if (diff < 60) {
        return (future) ? "In" + diff + " min" : diff + " min ago";
    }

    let d = new Date(date*1000);
    let dNow = new Date();

    if (d.toDateString() == dNow.toDateString()) {
        return d.toLocaleTimeString();
    } else {
        return d.toLocaleString();
    }
}

export class DefaultNotificationView extends React.Component<NotificationViewProps> {
    render(): React.ReactNode {
        return <div className="notification">
            <div className="notificationMeta">
                <span className="notificationSender">{this.props.sender.name}</span>
                <div className="notificationSenderSeparator" />
                <span className="notificationTime">{getTimeText(this.props.notification.timestamp)}</span>
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