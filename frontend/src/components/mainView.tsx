import * as React from 'react';
import {Notification, User} from 'types';
import NotificationView from 'components/notificationView'
import TopBarView from 'components/topBarView'

type MainViewProps = {
    user: User,
    notifications: Notification[]
}

export default class MainView extends React.Component<MainViewProps> {

    render(): React.ReactNode {
        return <div>
            <TopBarView user={this.props.user} />
            {this.props.notifications.map(value => {
                return <NotificationView key={value.id} notification={value} />
            })}
        </div>;
    }
}
