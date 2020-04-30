import * as WebSocket from "ws";
import Notification, {INotification} from "./types/notification";
import Subscription, {ISubscription} from "./types/subscription";

export class WebSocketManager {
    private sessions: {[index: string]: WebSocketSession[]} = {};

    public insertSession(usrId: string, session: string, socket: WebSocket) {
        if (!(usrId in this.sessions)) {
            this.sessions[usrId] = [];
        }
        this.sessions[usrId].push(new WebSocketSession(socket, session, usrId, this.onDisconnect.bind(this)));
    }

    public canNotify(usrId: string): boolean {
        return usrId in this.sessions;
    }

    public listener(ws: WebSocket, req: Express.Request): void {
        this.insertSession(req.session.user.id, req.session.id, ws);
    }

    private onDisconnect(wss: WebSocketSession, usrId: string) {
        this.sessions[usrId].splice( this.sessions[usrId].indexOf(wss), 1);
        if (this.sessions[usrId].length == 0) {
            delete this.sessions[usrId];
        }
    }

    private broadcastEvent(usrId: string, evtType: string, evtData: any, excludeSession?: string) {
        if (!(usrId in this.sessions)) return;

        this.sessions[usrId].filter(x => x.session !== excludeSession).forEach(x => x.sendEvent(evtType, evtData));
    }

    public loadAndCreateSubscriptionInBackground(subId: string, usrId: string, excludeSession?: string) {
        let mgr = this;
        setTimeout(async function () {
            let sub = await Subscription.findById(subId).populate('app', { cert: 0 });
            mgr.broadcastEvent(usrId, "createSubscription", sub, excludeSession);
        }, 0);
    }

    public loadAndUpdateSubscriptionsForAppInBackground(appId: string) {
        let mgr = this;
        setTimeout(async function () {
            let subs = await Subscription.find({app: appId}).populate('app', { cert: 0 });
            subs.filter(x => mgr.canNotify(x.userId)).forEach(x => mgr.updateSubscription(x, x.userId));
        }, 0);
    }

    public updateSubscription(sub: ISubscription, usrId: string, excludeSession?: string) {
        this.broadcastEvent(usrId, "updateSubscription", sub, excludeSession);
    }

    public deleteSubscription(subId: string, usrId: string, excludeSession?: string) {
        this.broadcastEvent(usrId, "deleteSubscription", subId, excludeSession);
    }

    public createNotification(not: INotification, usrId: string, excludeSession?: string) {
        this.broadcastEvent(usrId, "createNotification", not, excludeSession);
    }

    public loadAndUpdateNotificationInBackground(notId: string, usrId?: string, excludeSession?: string) {
        if (usrId == undefined || this.canNotify(usrId)) {
            let mgr = this;
            setTimeout(async function () {
                let not = await Notification.findById(notId);
                if (not != null) {
                    mgr.updateNotification(not, not.userId, excludeSession);
                }
            }, 0);
        }
    }

    public updateNotification(not: INotification, usrId: string, excludeSession?: string) {
        this.broadcastEvent(usrId, "updateNotification", not, excludeSession);
    }

    public deleteNotification(notId: string, usrId: string, excludeSession?: string) {
        this.broadcastEvent(usrId, "deleteNotification", notId, excludeSession);
    }
}

class WebSocketSession {
    private socket: WebSocket;
    public readonly session: string;
    private readonly usrId: string;
    private readonly onDisconnect: (wss: WebSocketSession, usrId: string) => void;

    constructor(socket: WebSocket, session: string, usrId: string, onDisconnect: (wss: WebSocketSession, usrId: string) => void) {
        this.socket = socket;
        this.session = session;
        this.usrId = usrId;
        this.onDisconnect = onDisconnect;
        this.socket.onclose = () => this.onDisconnect(this, this.usrId);
        this.socket.onerror = () => this.socket.close();
    }

    public sendEvent(evtType: string, evtData: any) {
        this.socket.send(
            JSON.stringify({
            "type": evtType,
            "data": evtData
            })
        );
    }

}
