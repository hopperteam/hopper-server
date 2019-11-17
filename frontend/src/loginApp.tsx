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

function getUrlParameter(sParam: string) {
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split('&');

    for (let i = 0; i < sURLVariables.length; i++) {
        let sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

let useDummyApi = !!getUrlParameter("dummy");
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

    let redirect = getUrlParameter("redirect");
    if (redirect && typeof(redirect) === 'string') {
        document.location.assign(redirect);
        return
    }
    document.location.assign("/app");
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

