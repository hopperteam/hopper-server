import LoadingController from "../loadingController";
import {Notification} from "../types";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;
import loadingController from "../loadingController";

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
        "updateNotification": WebSocketAdapter.onUpdateNotificationEvent
    };

    private static onCreateNotificationEvent(adapter: WebSocketAdapter, data: Notification) {
        adapter.loadingController.insertNotification(data);
    }

    private static onDeleteNotificationEvent(adapter: WebSocketAdapter, data: string) {
        adapter.loadingController.deleteNotificationById(data);
    }

    private static onUpdateNotificationEvent(adapter: WebSocketAdapter, data: Notification) {
        adapter.loadingController.updateNotification(data);
    }

    private ws: WebSocket;
    private loadingController: LoadingController;

    constructor(ws: WebSocket, loadingController: LoadingController) {
        this.ws = ws;
        this.loadingController = loadingController;
        ws.onmessage = this.onMessage.bind(this);
        ws.onerror = () => console.log("WS: ERROR");
    }

    private onMessage(evt: MessageEvent) {
        console.log(evt);
        let hopperEvent = JSON.parse(evt.data);
        WebSocketAdapter.eventHandlers[hopperEvent.type](this, hopperEvent.data);
    }

}
