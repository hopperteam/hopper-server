import * as React from "react";
import * as ReactDOM from 'react-dom';
import {User} from "types";
import LoginView from "components/loginView";
import LoadingView from "components/loadingView"
import DummyHopperApi from "api/dummyHopperApi";
import SerializationUtil from "serializationUtil";
import {HopperApi, IHopperApi} from "./api/hopperApi";
import {HopperUtil} from "./hopperUtil";

function renderLoadingView() {
    ReactDOM.render(
        <LoadingView />,
        document.getElementById("root")
    );
}


let useDummyApi = !!HopperUtil.getUrlParameter("dummy");
let api: IHopperApi = (useDummyApi) ? new DummyHopperApi(): new HopperApi();
if (useDummyApi) {
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

    let redirect = HopperUtil.getUrlParameter("redirect");
    if (redirect && typeof(redirect) === 'string') {
        document.location.assign(redirect);
        return
    }
    document.location.assign("/app");
}

async function main() {
    renderLoadingView();
    if (await SerializationUtil.getAndCheckStoredSession() != undefined) {
        loginComplete();
        return;
    }


    render();
}

main();

