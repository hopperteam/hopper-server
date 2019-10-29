import * as React from 'react';
import {User} from 'types';
import {NotificationSet} from "notificationSet";
import {NotificationContainer} from 'components/notificationContainer'
import TopBarView from 'components/topBarView'
import LoadingController from "../loadingController";

type MainViewProps = {
    user: User,
    notifications: NotificationSet,
    loadingController: LoadingController
}

export default class MainView extends React.Component<MainViewProps> {

    constructor(props: MainViewProps) {
        super(props);
    }

    render(): React.ReactNode {
        return <div id="mainView">
            <TopBarView user={this.props.user} />
            <NotificationContainer notifications={this.props.notifications} loadingController={this.props.loadingController} />
        </div>;
    }
}
