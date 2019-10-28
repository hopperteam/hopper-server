import * as express from 'express';
import Handler from './handler';
import App from '../types/app'
import Log from '../log';

const log: Log = new Log("AppHandler");

export default class AppHandler extends Handler {

    private apps: Array<App> = [
        App.fromDbJson({
            id: "0",
            name: "Whatsapp",
            imageUrl: "https://web.whatsapp.com/image.png",
            isActive: true,
            isHidden: false,
            baseUrl: "web.whatsapp.com",
            manageUrl: "https://web.whatsapp.com/manage"
        }),
        App.fromDbJson({
            id: "1",
            name: "Telegram",
            imageUrl: "https://web.telegram.com/image.png",
            isActive: true,
            isHidden: false,
            baseUrl: "web.telegram.com",
            manageUrl: "https://web.telegram.com/manage"
        }),
        App.fromDbJson({
            id: "2",
            name: "Slack",
            imageUrl: "https://slack.com/image.png",
            isActive: true,
            isHidden: false,
            baseUrl: "slack.com",
            manageUrl: "https://slack.com/manage"
        })
    ];

    constructor() {
        super();
        this.router.get("/apps", this.getApps.bind(this));
        this.router.delete("/apps", this.deleteApp.bind(this));
    }

    private async getApps(req: express.Request, res: express.Response): Promise<void> {
        try {
            //get apps from db
        } catch (e) {
            log.error(e);
            res.json({
                "status": "error",
                "reason": "DB Error"
            });
            return;
        }
        res.json(this.apps);
    }

    private async deleteApp(req: express.Request, res: express.Response): Promise<void> {
        try {
            var id: number|undefined = ("id" in req.query) ? parseInt(req.query["id"]) : undefined;
            if (id == undefined || isNaN(id)) {
                res.json({
                    "status": "error",
                    "reason": "please provide a valid index"
                });
                return;
            }
            // await database to remove link
            this.apps.splice(id,1);
            log.info("App with id " + id + " removed");
            res.json({
                "status": "succes"
            });
        } catch (e) {
            log.error(e);
            res.json({
                "status": "error",
                "reason": "DB Error"
            });
            return;
        }
    }
}