import * as React from "react";
import * as ReactDOM from 'react-dom';
import {App, Notification, User} from "types";
import {NotificationSet} from "notificationSet"
import MainView from "components/mainView";
import LoadingView from "components/loadingView";
import LoginView from "components/loginView";

require("css/app.css");
require("css/notification.css");

let user: User = new User("Max Mustermann", "max.mu@stermann.de");

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

function simulateData() {
    const not = new Notification(1,"Account created", 1, Date.now(), undefined, false, false, "default", "Welcome to your hopper account!", []);
    const not2 = new Notification(2,"This is a notification", 1,Date.now() - 1000, undefined, false, false, "default", "Any app will appear here!", []);
    notifications.integrateNotifications([not, not2]);
}

let notifications = new NotificationSet();
let app = new App(1, "Hopper Welcome Service", require("./img/logo_small.svg"), true, false,"hoppercloud.net", "https://app.hoppercloud.net");
notifications.insertApp(app);

loggedIn();
simulateData();
updateView();

