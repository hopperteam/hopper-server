import * as React from "react";
import * as ReactDOM from 'react-dom';
import MainView from "components/mainView";
import {App, Notification} from "./types";

const styles = require("css/app.css");

let notifications: Notification[] = [];

function updateView() {
    ReactDOM.render(
        <MainView notifications={notifications}/>,
        document.getElementById("root")
    );
}

updateView();

setTimeout(() => {
    console.log("update!");
    const app = new App(123, "WhatsApp")
    const not = new Notification(1, app, "Message 1", "This is message 1");
    const not2 = new Notification(2, app, "Message 2", "This is message 2");
    notifications.push(not);
    notifications.push(not2);
    updateView();
}, 2000);

