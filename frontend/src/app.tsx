import * as React from "react";
import * as ReactDOM from 'react-dom';
import {User} from "types";
import {NotificationSet} from "notificationSet"
import MainView from "components/mainView";
import LoadingView from "components/loadingView";
import LoadingController from "loadingController";
import DummyHopperApi from "api/dummyHopperApi";
import SerializationUtil from "./serializationUtil";
import {IHopperApi} from "./api/hopperApi";

require("css/app.css");
require("css/notification.css");

const UPDATE_INTERVAL = 30000;

function renderLoadingView() {
    ReactDOM.render(
        <LoadingView />,
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

function navigateToLogin() {
    SerializationUtil.deleteStoredSession();
    document.location.assign("/");
}

async function main() {
    renderLoadingView();
    let api: IHopperApi|undefined;
    let user: User|undefined;

    if (SerializationUtil.hasStoredSession()) {
        api = SerializationUtil.getStoredSession();
        user = await api.getCurrentUser();
        if (user == undefined) {
            navigateToLogin();
            return;
        }
    } else {
        navigateToLogin();
        return;
    }

    let notifications = new NotificationSet();

    let loadingController = new LoadingController(api, notifications);
    await loadingController.loadApps();

    console.log(loadingController);

    updateView(user, notifications, loadingController);
}

main();


