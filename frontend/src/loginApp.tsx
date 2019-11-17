import * as React from "react";
import * as ReactDOM from 'react-dom';
import {User} from "types";
import LoginView from "components/loginView";
import LoadingView from "components/loadingView"
import DummyHopperApi from "api/dummyHopperApi";
import SerializationUtil from "serializationUtil";
import {HopperApi, IHopperApi} from "./api/hopperApi";
import {Util} from "./util";

function renderLoadingView() {
    ReactDOM.render(
        <LoadingView />,
        document.getElementById("root")
    );
}


let useDummyApi = !!Util.getUrlParameter("dummy");
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

    let redirect = Util.getUrlParameter("redirect");
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

