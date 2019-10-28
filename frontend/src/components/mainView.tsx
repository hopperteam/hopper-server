import * as React from 'react';
import {User} from 'types';
import {NotificationIterator, NotificationSet} from "notificationSet";
import {NotificationContainer} from 'components/notificationView'
import TopBarView from 'components/topBarView'
import LoadingController from "../loadingController";

type MainViewProps = {
    user: User,
    notifications: NotificationSet,
    loadingController: LoadingController
}

type MainViewState = {
    currentNotificationIterator: NotificationIterator
}

export default class MainView extends React.Component<MainViewProps, MainViewState> {

    constructor(props: MainViewProps) {
        super(props);
        this.state = {
            currentNotificationIterator: this.props.notifications.getGeneralIterator(false)
        }
    }

    render(): React.ReactNode {
        console.log(JSON.stringify(this.props.notifications));
        console.log(this.props.notifications);
        return <div id="mainView">
            <TopBarView user={this.props.user} />
            <NotificationContainer notifications={this.props.notifications} loadingController={this.props.loadingController} />
        </div>;
    }
}
