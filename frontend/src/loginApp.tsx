import * as React from "react";
import * as ReactDOM from 'react-dom';
import {User} from "types";
import LoginView from "components/loginView";
import LoadingView from "components/loadingView"
import DummyHopperApi from "api/dummyHopperApi";
import SerializationUtil from "serializationUtil";
import {IHopperApi} from "./api/hopperApi";

function renderLoadingView() {
    ReactDOM.render(
        <LoadingView />,
        document.getElementById("root")
    );
}

let api: IHopperApi = new DummyHopperApi();

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
        if (await api.hasValidSession()) {
            loginComplete();
        }
    }

    render();
}

renderLoadingView();

main();

