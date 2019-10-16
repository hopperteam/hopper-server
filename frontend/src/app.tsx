import * as React from "react";
import * as ReactDOM from 'react-dom';
import {App, Notification, User} from "./types";
import MainView from "components/mainView";
import LoadingView from "components/loadingView";
import LoginView from "./components/loginView";

const styles = require("css/app.css");

let user: User = new User("Max Mustermann", "max.mu@stermann.de");
let notifications: Notification[] = [];

function renderLoadingView() {
    ReactDOM.render(
        <LoadingView />,
        document.getElementById("root")
    );
}

function renderLoginView() {
    ReactDOM.render(
        <LoginView onLoggedIn={loggedIn} />,
        document.getElementById("root")
    );
}

function loggedIn() {

}

function updateView() {
    ReactDOM.render(
        <MainView user={user} notifications={notifications} />,
        document.getElementById("root")
    );
}

renderLoadingView();


function simulateData() {
    console.log("update!");
    const app = new App(123, "WhatsApp")
    const not = new Notification(1, app, "Message 1", "This is message 1");
    const not2 = new Notification(2, app, "Message 2", "This is message 2");
    notifications.push(not);
    notifications.push(not2);
    updateView();
}
setTimeout(() => {
    renderLoginView()
}, 2000);



