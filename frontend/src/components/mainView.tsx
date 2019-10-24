import * as React from 'react';
import {User} from 'types';
import {NotificationIterator, NotificationSet} from "notification";
import NotificationContainer from 'components/notificationView'
import TopBarView from 'components/topBarView'

type MainViewProps = {
    user: User,
    notifications: NotificationSet
}

type MainViewState = {
    currentNotificationIterator: NotificationIterator
}

export default class MainView extends React.Component<MainViewProps, MainViewState> {

    constructor(props: MainViewProps) {
        super(props);
        this.state = {
            currentNotificationIterator: this.props.notifications.getUnfilteredIterator()
        }
    }

    render(): React.ReactNode {
        return <div>
            <TopBarView user={this.props.user} />
            <NotificationContainer iterator={this.state.currentNotificationIterator}/>
        </div>;
    }
}
