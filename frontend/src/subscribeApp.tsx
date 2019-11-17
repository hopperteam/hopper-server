import * as React from "react";
import * as ReactDOM from 'react-dom';
import LoadingView from "components/loadingView"
import { IHopperApi} from "api/hopperApi";
import {HopperUtil} from "hopperUtil";
import {SubscribeRequest, User} from "types";
import SerializationUtil from "serializationUtil";
import SubscribeView from "./components/subscribeView";


function renderLoadingView() {
    ReactDOM.render(
        <LoadingView />,
        document.getElementById("root")
    );
}

function navigateToLogin() {
    SerializationUtil.deleteStoredSession();
    document.location.assign("/?redirect=" + encodeURIComponent(location.pathname + location.search));
}

function renderError(error: string) {
    ReactDOM.render(
        <p>Error: {error}</p>,
        document.getElementById("root")
    );
}

function render(req: SubscribeRequest, user: User, onAccept: () => void, onDecline: () => void) {
    ReactDOM.render(
        <SubscribeView request={req} user={user} onAccept={onAccept} onDecline={onDecline} />,
        document.getElementById("root")
    );
}

function submitCallback(callback: string, subId: string|undefined, error: string|undefined) {
    let cb = callback;
    cb += ((cb.indexOf("?") != -1) ? "&status=" : "?status=") + ((subId != undefined) ? "success" : "failed");
    if (subId != undefined) {
        cb += "&subscriptionId=" + encodeURIComponent(subId);
    } else if (error != undefined) {
        cb += "&error=" + encodeURIComponent(error);
    }
    location.href = cb;
}

async function main() {
    let res = await SerializationUtil.getAndCheckStoredSession();
    if (res == undefined) {
        navigateToLogin();
        return;
    }
    let api: IHopperApi = res[0];
    let user: User = res[1];

    let sp = HopperUtil.getUrlParameter("id");
    let data = HopperUtil.getUrlParameter("data");

    if (sp == undefined || data == undefined || typeof(sp) != 'string' || typeof(data) != 'string') {
        renderError("Invalid request");
        return;
    }

    let reqData = data;
    let appId = sp;

    let subscribeRequestUndef = await api.getSubscribeRequest(reqData, appId);
    if (subscribeRequestUndef == undefined) {
        renderError("Could not parse request");
        return;
    }

    let subscribeRequest = subscribeRequestUndef;

    render(subscribeRequest, user, async () => {
        let subId = await api.postSubscribeRequest(reqData, appId);
        if (subId == undefined) {
            submitCallback(subscribeRequest.callback, undefined, "Server error");
            return;
        }
        submitCallback(subscribeRequest.callback, subId, undefined);
    }, () => {
        submitCallback(subscribeRequest.callback, undefined, "Declined by user");
    });
}

renderLoadingView();

main();

