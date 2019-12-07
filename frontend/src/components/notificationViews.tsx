import * as React from "react";
import {NotificationViewProps} from "./notificationContainer";

function getTimeText(date: number): string {
    let diff = Date.now() - date;
    let future = diff < 0;
    diff = Math.abs(diff);

    if (diff < 60000) {
        return "now";
    }

    diff = Math.floor(diff / 60000);
    if (diff < 60) {
        return (future) ? "In " + diff + " min" : diff + " min ago";
    }

    let d = new Date(date);
    let dNow = new Date();

    if (d.toDateString() == dNow.toDateString()) {
        return d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
    } else {
        return d.toLocaleString([], {year: "2-digit", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit"});
    }
}

export class DefaultNotificationView extends React.Component<NotificationViewProps> {
    render(): React.ReactNode {
        return <div id={"not-" + this.props.notification.id} className="notification">
            <div className="notificationMeta">
                <span className="notificationSender">{this.props.subscription.app.name}</span>
                <div className="notificationSenderSeparator" />
                <span className="notificationTime">{getTimeText(this.props.notification.timestamp)}</span>
                <button className="markDoneButton" onClick={ () => this.props.toggleDoneFunction(this.props.notification) }>Mark as {!this.props.notification.isDone ? "done" : "undone"}</button>
                <button className="deleteButton" onClick={ () => this.props.deleteFunction(this.props.notification) }>Delete</button>
            </div>
            <div className="notificationContent">
                <img className="notificationImage" alt="notificationImage" src={
                    this.props.notification.imageUrl != undefined ? this.props.notification.imageUrl : this.props.subscription.app.imageUrl}
                />
                <p className="notificationTitle">{this.props.notification.heading}</p>
                <div className="notificationBody">
                    {(this.props.notification.content as string).split("\n")
                        .map((line, key) => {
                        return <span key={key}>
                            {line}
                            <br />
                        </span>
                    })}
                </div>
            </div>
        </div>
    }
}
