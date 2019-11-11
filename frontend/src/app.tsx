import * as React from "react";
import * as ReactDOM from 'react-dom';
import {User} from "types";
import {NotificationSet} from "notificationSet"
import MainView from "components/mainView";
import LoadingView from "components/loadingView";
import LoginView from "components/loginView";
import LoadingController from "loadingController";
import DummyHopperApi from "api/dummyHopperApi";

require("css/app.css");
require("css/notification.css");

const UPDATE_INTERVAL = 30000;

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
    setTimeout(() => {
        updateView(user, notifications, loadingController);
    });
}

function updateLoop(user: User, notifications: NotificationSet, loadingController: LoadingController) {
    setTimeout(() => updateLoop(user, notifications, loadingController), UPDATE_INTERVAL);
    updateView(user, notifications, loadingController);
}

async function main() {
    renderLoadingView();

    let user: User = new User("Max Mustermann", "max.mu@stermann.de");

    let notifications = new NotificationSet();
    let api = new DummyHopperApi();

    let loadingController = new LoadingController(api, notifications);
    await loadingController.loadApps();

    console.log(loadingController);

    updateView(user, notifications, loadingController);
}

main();


