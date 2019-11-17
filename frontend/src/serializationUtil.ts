import Cookies from 'js-cookie'
import DummyHopperApi from "./api/dummyHopperApi";
import {IHopperApi, HopperApi} from "./api/hopperApi";
import {User} from "./types";

export default class SerializationUtil {
    public static hasStoredSession() {
        return (Cookies.get("sid") != undefined && Cookies.get("hopper_api_root") != undefined) || Cookies.get("hopper_api_root") == "#DUMMY#"
    }

    public static getStoredSession(): IHopperApi {
        let apiPath = Cookies.get("hopper_api_root");
        if (apiPath == "#DUMMY#" || apiPath == undefined) {
            return new DummyHopperApi();
        }
        return new HopperApi(apiPath);
    }

    public static storeSession(api: IHopperApi) {
        if (api instanceof HopperApi) {
            Cookies.set("hopper_api_root", (api as HopperApi).apiRoot)
        } else {
            Cookies.set("hopper_api_root", "#DUMMY#")
        }
    }

    public static deleteStoredSession() {
        Cookies.remove("hopper_api_root");
    }

    public static async getAndCheckStoredSession(): Promise<[IHopperApi, User] | undefined> {
        if (SerializationUtil.hasStoredSession()) {
            let api = SerializationUtil.getStoredSession();
            let user = await api.getCurrentUser();
            if (user != undefined) {
                return [api, user];
            }
        }
    }
}
