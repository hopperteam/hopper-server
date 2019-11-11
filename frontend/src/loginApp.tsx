import * as React from "react";
import * as ReactDOM from 'react-dom';
import {User} from "types";
import LoginView from "components/loginView";
import LoadingView from "components/loadingView"
import DummyHopperApi from "api/dummyHopperApi";
import SerializationUtil from "serializationUtil";
import {HopperApi, IHopperApi} from "./api/hopperApi";

function renderLoadingView() {
    ReactDOM.render(
        <LoadingView />,
        document.getElementById("root")
    );
}

let api: IHopperApi = (document.location.hash == "#dummy") ? new DummyHopperApi(): new HopperApi();
if (document.location.hash == "#dummy") {
    console.log("Using dummy api!");
}

function render() {
    ReactDOM.render(
        <LoginView onLoggedIn={loginComplete} api={api}/>,
        document.getElementById("root")
    );
}

function loginComplete() {
    SerializationUtil.storeSession(api);
    document.location.assign("/app")
}

async function main() {
    if (SerializationUtil.hasStoredSession()) {
        api = SerializationUtil.getStoredSession();
        let user = await api.getCurrentUser();
        if (user != undefined) {
            loginComplete();
            return;
        }
    }

    render();
}

renderLoadingView();

main();

