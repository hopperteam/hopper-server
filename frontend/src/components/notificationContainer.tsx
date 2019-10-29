import * as React from 'react';
import {NotificationSet} from 'notificationSet';
import {App, Notification} from "../types";
import LoadingController from "../loadingController";
import {ChangeEvent} from "react";
import loadingController from "../loadingController";
import {DefaultNotificationView} from "./notificationViews";

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
    showLoadingElement: boolean
}

type NotificationFilterChooserProps = {
    includeDone: boolean,
    notifications: NotificationSet,
    currentApp: string | undefined,
    loadingController: loadingController,
    onUpdate: (includeDone: boolean, currentApp: string | undefined) => void
}


export type NotificationViewProps = {
    notification: Notification,
    sender: App
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
        window.addEventListener("resize", this.resizeListener);
        await this.callCheckScrollState();
    }

    componentWillUnmount(): void {
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

    render(): React.ReactNode {
        return <div id="notificationContainer" onScroll={ e => this.checkScrollState(e.target as HTMLElement) } >
            <NotificationFilterChooser notifications={this.props.notifications} currentApp={this.state.currentApp} includeDone={this.state.includeDone} onUpdate={this.onFilterUpdate.bind(this)} loadingController={this.props.loadingController} />
            <NotificationList notifications={this.props.notifications} mapFunction={this.props.loadingController.getMapFunction(this.state.includeDone, this.state.currentApp)} showLoadingElement={!this.state.loadingFinished} />
        </div>
    }

    async componentDidUpdate(prevProps: Readonly<NotificationContainerProps>, prevState: Readonly<NotificationContainerState>, snapshot?: any) {
        await this.callCheckScrollState();
    }
}

export class NotificationFilterChooser extends React.Component<NotificationFilterChooserProps> {

    private onIncludeDoneChange(evt: ChangeEvent<HTMLInputElement>) {
        this.props.onUpdate(evt.target.checked, this.props.currentApp);
    }

    private onAppClick(appId: string) {
        if (appId == this.props.currentApp) {
            this.props.onUpdate(this.props.includeDone, undefined);
        } else {
            this.props.onUpdate(this.props.includeDone, appId);
        }
    }

    render(): React.ReactNode {
        return <div id="notificationFilterChooser" >
            <input type="checkbox" onChange={this.onIncludeDoneChange.bind(this)} checked={this.props.includeDone} id="includeDoneSelector"/>
            {
                Object.keys(this.props.notifications.appCategories)
                    .map(appId => {
                        return {app: this.props.notifications.apps[appId], notifications: this.props.loadingController.getLoaded(false, appId)};
                    })
                    .sort((x, y) => y.notifications - x.notifications)
                    .map(x => {
                        return <img src={x.app.imageUrl} alt={x.app.name + " (" + x.notifications + ")"} onClick={() => this.onAppClick(x.app.id)} className={x.app.id == this.props.currentApp ? "appFilter appFilterSelected" : "appFilter"} />;
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
                return React.createElement(x, {key: value.id, notification: value, sender: this.props.notifications.apps[value.serviceProvider]}, null);
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

