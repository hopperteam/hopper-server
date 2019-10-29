import * as React from "react";
import {NotificationViewProps} from "./notificationContainer";

export class DefaultNotificationView extends React.Component<NotificationViewProps> {
    render(): React.ReactNode {
        return <div className="notification">
            <div className="notificationMeta">
                <span className="notificationSender">{this.props.sender.name}</span>
                <div className="notificationSenderSeparator" />
                <span className="notificationTime">{this.props.notification.timestamp}</span>
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
