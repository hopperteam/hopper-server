import * as React from "react";
import * as ReactDOM from 'react-dom';
import {User} from "./types";
import {App, Notification, NotificationSet} from "notification"
import MainView from "components/mainView";
import LoadingView from "components/loadingView";
import LoginView from "./components/loginView";

const styles = require("css/app.css");

let user: User = new User("Max Mustermann", "max.mu@stermann.de");
let notifications = new NotificationSet();

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
    updateView();
}

function updateView() {
    ReactDOM.render(
        <MainView user={user} notifications={notifications} />,
        document.getElementById("root")
    );
}

renderLoadingView();

const app = new App(123, "WhatsApp");

function simulateData() {
    const not = new Notification(1, app, "Message 1", "This is message 1", 123);
    const not2 = new Notification(2, app, "Message 2", "This is message 2", 456);
    notifications.integrateNotifications([not, not2]);
}

/*setTimeout(() => {
    renderLoginView()
}, 200);
*/
loggedIn();
simulateData();
updateView();

notifications.updateNotitifaction(new Notification(2, app, "Message 2 Updated", "yeah", 456));
updateView();
