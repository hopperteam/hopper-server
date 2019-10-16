import * as React from 'react';

export default class LoadingView extends React.Component {

    render(): React.ReactNode {
        return <div id="loadingView">
            <span>Loading...</span>
        </div>;
    }
}
