import * as React from 'react';
import {Notification} from 'types';
import NotificationView from 'components/notificationView'

type MainViewProps = {
    notifications: Notification[]
}

export default class MainView extends React.Component<MainViewProps> {

    render(): React.ReactNode {
        return <div>
            {this.props.notifications.map(value => {
                return <NotificationView key={value.id} notification={value} />
            })}
        </div>;
    }
}
