import * as React from 'react';
import {NotificationIterator, NotificationSet} from 'notificationSet';
import {App, Notification} from "../types";
import LoadingController from "../loadingController";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

type NotificationContainerProps = {
    iterator: NotificationIterator,
    notifications: NotificationSet,
    loadingController: LoadingController
}

type NotificationContainerState = {
    currentlyLoading: boolean,
    loadingFinished: boolean
}

type NotificationListProps = {
    iterator: NotificationIterator,
    notifications: NotificationSet,
    showLoadingElement: boolean
}

type NotificationViewProps = {
    notification: Notification,
    sender: App
}

export class NotificationContainer extends React.Component<NotificationContainerProps, NotificationContainerState> {


    constructor(props: Readonly<NotificationContainerProps>) {
        super(props);
        this.state = { currentlyLoading: false, loadingFinished: false }
    }

    private async checkScrollState(el: HTMLElement): Promise<void> {
        if (this.state.loadingFinished) return;
        let invisibleSpaceBottom = el.scrollHeight - el.offsetHeight - el.scrollTop;

        if (invisibleSpaceBottom < 1000) {
            if (this.state.currentlyLoading) return;
            this.setState({currentlyLoading: true});

            let loaded = await this.props.loadingController.loadNotifications(false, undefined);

            this.setState({currentlyLoading: false, loadingFinished: !loaded});
        }
        return this.checkScrollState(el);
    }

    private async callCheckScrollState() {
        let x = document.getElementById("notificationContainer");
        if (x == null) return;
        return this.checkScrollState(x);
    }

    private resizeListener = this.callCheckScrollState.bind(this);

    async componentDidMount() {
        window.addEventListener("resize", this.resizeListener);
        await this.callCheckScrollState();
    }

    componentWillUnmount(): void {
        window.removeEventListener("resize", this.resizeListener);
    }

    render(): React.ReactNode {
        this.props.iterator.reset();
        return <div id="notificationContainer" onScroll={ e => this.checkScrollState(e.target as HTMLElement) } >
            <NotificationList notifications={this.props.notifications} iterator={this.props.iterator} showLoadingElement={!this.state.loadingFinished} />
        </div>
    }
}

export class NotificationList extends React.Component<NotificationListProps> {
    render(): React.ReactNode {
        this.props.iterator.reset();
        return <div id="notificationList" >
            {this.props.iterator.map(value => {
                return <NotificationView key={value.id} notification={value} sender={this.props.notifications.apps[value.serviceProvider]}/>
            })}
            { this.props.showLoadingElement ? <LoadingNotificationView /> : "" }
        </div>
    }
}

export class LoadingNotificationView extends React.Component {
    render(): React.ReactNode {
        return <div className="notification">
            ...
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
