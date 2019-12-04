import LoadingController from "../loadingController";
import {Notification, Subscription} from "../types";
import {DesktopNotificationManager} from "../desktopNotificationManager";

export class WebSocketAdapter {
    static async openWebSocket(loadingController: LoadingController): Promise<WebSocketAdapter> {
        let ws = await new Promise<WebSocket>(function(resolve, reject) {
            let protocol = "wss://";
            if (document.location.protocol == "http:") protocol = "ws://";
            let ws = new WebSocket(protocol + document.location.hostname + "/api/v1/ws");
            ws.onopen = function() {
                resolve(ws);
            };
            ws.onerror = function(err) {
                reject(err);
            };
        });
        return new WebSocketAdapter(ws, loadingController);
    }

    private static eventHandlers: {[index: string]: (adapter: WebSocketAdapter, data: any) => void} = {
        "createNotification": WebSocketAdapter.onCreateNotificationEvent,
        "deleteNotification": WebSocketAdapter.onDeleteNotificationEvent,
        "updateNotification": WebSocketAdapter.onUpdateNotificationEvent,
        "createSubscription": WebSocketAdapter.onCreateSubscriptionEvent,
        "deleteSubscription": WebSocketAdapter.onDeleteSubscriptionEvent,
        "updateSubscription": WebSocketAdapter.onUpdateSubscriptionEvent
    };

    private static onCreateNotificationEvent(adapter: WebSocketAdapter, data: Notification) {
        adapter.loadingController.insertNotification(data, true);
    }

    private static onDeleteNotificationEvent(adapter: WebSocketAdapter, data: string) {
        adapter.loadingController.deleteNotificationById(data);
    }

    private static onUpdateNotificationEvent(adapter: WebSocketAdapter, data: Notification) {
        adapter.loadingController.updateNotification(data);
    }

    private static onCreateSubscriptionEvent(adapter: WebSocketAdapter, data: Subscription) {
        adapter.loadingController.insertSubscription(data);
    }

    private static onDeleteSubscriptionEvent(adapter: WebSocketAdapter, data: string) {
        adapter.loadingController.deleteSubscription(data);
    }

    private static onUpdateSubscriptionEvent(adapter: WebSocketAdapter, data: Subscription) {
        adapter.loadingController.updateSubscription(data);
    }

    private ws: WebSocket;
    private loadingController: LoadingController;

    constructor(ws: WebSocket, loadingController: LoadingController) {
        this.ws = ws;
        this.loadingController = loadingController;
        ws.onmessage = this.onMessage.bind(this);
        ws.onclose = () => console.log("WS: Disconnected!");
        ws.onerror = () => console.log("WS: ERROR");
    }

    private onMessage(evt: MessageEvent) {
        let hopperEvent = JSON.parse(evt.data);
        console.log("HopperEvent{type=\"" + hopperEvent.type + "\", data=\"" + JSON.stringify(hopperEvent.data) + "\"}");
        WebSocketAdapter.eventHandlers[hopperEvent.type](this, hopperEvent.data);
    }

}
