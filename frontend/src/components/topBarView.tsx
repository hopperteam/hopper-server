import * as React from 'react';
import {User} from 'types';

type TopBarViewProps = {
    user: User
    onClickLogout: () => void;
}

export default class TopBarView extends React.Component<TopBarViewProps> {

    render(): React.ReactNode {
        return <div id="topBar">
            <span>{this.props.user.firstName} {this.props.user.lastName} <a className="clickableLink" onClick={this.props.onClickLogout}>(Logout)</a></span>
        </div>;
    }
}
