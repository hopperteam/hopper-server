import * as React from "react";
import * as ReactDOM from 'react-dom';
import {User} from "./types";
import {App, Notification, NotificationSet} from "notification"
import MainView from "components/mainView";
import LoadingView from "components/loadingView";
import LoginView from "./components/loginView";

require("css/app.css");
require("css/notification.css");

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

const app = new App(123, "Hopper", require("img/logo_small.svg"));

function simulateData() {
    const not = new Notification(1, app, "Account created", "Welcome to your hopper account!", 123);
    const not2 = new Notification(2, app, "This is a notification", "Any app will appear here!", 456);
    notifications.integrateNotifications([not, not2]);
}

/*setTimeout(() => {
    renderLoginView()
}, 200);
*/
loggedIn();
simulateData();
updateView();

