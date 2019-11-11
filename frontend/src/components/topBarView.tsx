import * as React from 'react';
import {User} from 'types';
type TopBarViewProps = {
    user: User
}

export default class TopBarView extends React.Component<TopBarViewProps> {

    render(): React.ReactNode {
        return <div id="topBar">
            <span>{this.props.user.firstName} {this.props.user.lastName}</span>
        </div>;
    }
}
