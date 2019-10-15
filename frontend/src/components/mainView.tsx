import * as React from 'react';
const hopperLogo = require("../img/logo.svg");

export default class MainViewComponent extends React.Component {

    render(): React.ReactNode {
        return <div>
            <img src={hopperLogo} alt="hopperLogo" height="50" width="50" />
        </div>
    }
}
