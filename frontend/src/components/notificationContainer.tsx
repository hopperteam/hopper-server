import * as React from 'react';
import {NotificationSet} from 'notificationSet';
import {App, Notification, Subscription} from "../types";
import LoadingController from "../loadingController";
import {ChangeEvent} from "react";
import loadingController from "../loadingController";
import {DefaultNotificationView} from "./notificationViews";
import "style/notification.scss";

type NotificationContainerProps = {
    notifications: NotificationSet,
    loadingController: LoadingController
}

type NotificationContainerState = {
    currentlyLoading: boolean,
    loadingFinished: boolean,
    includeDone: boolean,
    currentApp: string | undefined
}

type NotificationListProps = {
    mapFunction: (fnc: (x: Notification) => any) => any[],
    notifications: NotificationSet,
    showLoadingElement: boolean,
    toggleDoneFunction: (not: Notification) => void,
    deleteFunction: (not: Notification) => void
}

type NotificationFilterChooserProps = {
    includeDone: boolean,
    notifications: NotificationSet,
    currentSubscription: string | undefined,
    loadingController: loadingController,
    onUpdate: (includeDone: boolean, currentApp: string | undefined) => void
}


export type NotificationViewProps = {
    notification: Notification,
    subscription: Subscription,
    toggleDoneFunction: (not: Notification) => void,
    deleteFunction: (not: Notification) => void
}

const notificationTypes: { [index: string] : React.ClassType<NotificationViewProps, any, any>} = {
    "default": DefaultNotificationView
};


export class NotificationContainer extends React.Component<NotificationContainerProps, NotificationContainerState> {
    constructor(props: Readonly<NotificationContainerProps>) {
        super(props);
        this.state = { currentlyLoading: false, loadingFinished: false, includeDone: false, currentApp: undefined }
    }

    private async checkScrollState(el: HTMLElement): Promise<void> {
        if (this.state.loadingFinished) return;
        let invisibleSpaceBottom = el.scrollHeight - el.offsetHeight - el.scrollTop;

        if (invisibleSpaceBottom < 1000) {
            if (this.state.currentlyLoading) return;
            this.setState({currentlyLoading: true});

            let loaded = await this.props.loadingController.loadNotifications(this.state.includeDone, this.state.currentApp);

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
        this.props.loadingController.onUpdateListener = () => {
            this.forceUpdate();
        };
        window.addEventListener("resize", this.resizeListener);
        await this.callCheckScrollState();
    }

    componentWillUnmount(): void {
        this.props.loadingController.onUpdateListener = () => { };
        window.removeEventListener("resize", this.resizeListener);
    }

    private onFilterUpdate(includeDone: boolean, currentApp: string | undefined) {
        this.setState({
            currentApp: currentApp,
            includeDone: includeDone,
            currentlyLoading: false,
            loadingFinished: this.props.loadingController.isFullyLoaded(includeDone, currentApp)
        });
    }

    private async toggleDone(not: Notification) {
        if (not.isDone) {
            await this.props.loadingController.markAsUndone(not);
        } else {
            await this.props.loadingController.markAsDone(not);
        }
    }

    private async deleteNotification(not: Notification) {
        await this.props.loadingController.deleteNotification(not);
    }

    render(): React.ReactNode {
        return <div id="notificationContainer" onScroll={ e => this.checkScrollState(e.target as HTMLElement) } >
            <NotificationFilterChooser notifications={this.props.notifications} currentSubscription={this.state.currentApp} includeDone={this.state.includeDone} onUpdate={this.onFilterUpdate.bind(this)} loadingController={this.props.loadingController} />
            <NotificationList notifications={this.props.notifications}
                              mapFunction={this.props.loadingController.getMapFunction(this.state.includeDone, this.state.currentApp)}
                              showLoadingElement={!this.state.loadingFinished}
                              toggleDoneFunction={this.toggleDone.bind(this)}
                              deleteFunction={this.deleteNotification.bind(this)} />
        </div>
    }

    async componentDidUpdate(prevProps: Readonly<NotificationContainerProps>, prevState: Readonly<NotificationContainerState>, snapshot?: any) {
        await this.callCheckScrollState();
    }
}

export class NotificationFilterChooser extends React.Component<NotificationFilterChooserProps> {

    private onIncludeDoneChange(evt: ChangeEvent<HTMLInputElement>) {
        this.props.onUpdate(evt.target.checked, this.props.currentSubscription);
    }

    private onSubscriptionClick(subscriptionId: string) {
        if (subscriptionId == this.props.currentSubscription) {
            this.props.onUpdate(this.props.includeDone, undefined);
        } else {
            this.props.onUpdate(this.props.includeDone, subscriptionId);
        }
    }

    render(): React.ReactNode {
        return <div id="notificationFilterChooser" >
            <input type="checkbox" onChange={this.onIncludeDoneChange.bind(this)} checked={this.props.includeDone} id="includeDoneSelector"/>
            {
                Object.keys(this.props.notifications.subscriptionCategories)
                    .map(subscriptionId => {
                        return {subscription: this.props.notifications.subscriptions[subscriptionId], notifications: this.props.loadingController.getLoaded(false, subscriptionId)};
                    })
                    .sort((x, y) => y.notifications - x.notifications)
                    .map(x => {
                        return <img src={x.subscription.app.imageUrl}
                                    alt={x.subscription.app.name + " (" + x.notifications + ")"}
                                    onClick={() => this.onSubscriptionClick(x.subscription.id)}
                                    id={"app-" + x.subscription.id}
                                    className={x.subscription.id == this.props.currentSubscription ? "appFilter appFilterSelected" : "appFilter"} />;
                    })
            }
        </div>
    }
}

export class NotificationList extends React.Component<NotificationListProps> {
    render(): React.ReactNode {
        return <div id="notificationList" >
            {this.props.mapFunction(value => {
                let x = notificationTypes[value.type];
                if (x == undefined) {
                    console.error("Could not render notification " + value.id + "! Invalid type " + value.type);
                    return;
                }
                return React.createElement(x, {key: value.id, notification: value, subscription: this.props.notifications.getSubscriptionOrDefault(value.subscription), toggleDoneFunction: this.props.toggleDoneFunction, deleteFunction: this.props.deleteFunction}, null);
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

