import * as React from "react";
import * as ReactDOM from 'react-dom';
import {App, Notification, User} from "types";
import {NotificationSet} from "notificationSet"
import MainView from "components/mainView";
import LoadingView from "components/loadingView";
import LoginView from "components/loginView";
import HopperApi from "./api";
import LoadingController from "./loadingController";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

require("css/app.css");
require("css/notification.css");

function renderLoadingView() {
    ReactDOM.render(
        <LoadingView />,
        document.getElementById("root")
    );
}

function renderLoginView() {
    ReactDOM.render(
        <LoginView onLoggedIn={() => { console.log("Logged in!") }} />,
        document.getElementById("root")
    );
}

function updateView(user: User, notifications: NotificationSet, loadingController: LoadingController) {
    ReactDOM.render(
        <MainView user={user} notifications={notifications} loadingController={loadingController} />,
        document.getElementById("root")
    );
}

async function main() {
    renderLoadingView();

    let user: User = new User("Max Mustermann", "max.mu@stermann.de");

    let notifications = new NotificationSet();
    let api = new HopperApi("1234");

    let loadingController = new LoadingController(api, notifications);
    await loadingController.loadApps();

    console.log(loadingController);

    updateView(user, notifications, loadingController);
}

main();


