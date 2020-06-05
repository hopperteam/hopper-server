import * as mongoose from 'mongoose';
import ISanitizer from './sanitizer';
import { isUrl, isEmail } from '../utils';
import Log from '../log';
import * as utils from '../utils';

export interface IApp extends mongoose.Document {
    name: string;
    imageUrl: string;
    isHidden: boolean;
    baseUrl: string;
    manageUrl: string | undefined;
    contactEmail: string;
    cert: string;
}

export class VerifyHelper {
    public app: IApp | null;
    public data: any | null;

    constructor(app: IApp | null, data: any | null) {
        this.app = app;
        this.data = data;
    }
}

// interface extending sanitizer
interface IAppStatic extends mongoose.Model<IApp>, ISanitizer {
    // other static methods
    verifyContent(id: string, content: any, log: Log): Promise<VerifyHelper>;
}

const AppSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    baseUrl: { type: String, required: true },
    manageUrl: { type: String },
    contactEmail: { type: String, required: true },
    cert: { type: String, required: true }
}, {
    versionKey: false // set to true to keep track of version of document
});

AppSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.contactEmail;
        delete ret.cert;
    }
});

// Validators
AppSchema.path('imageUrl').validate(isUrl);
AppSchema.path('baseUrl').validate(isUrl);
AppSchema.path('manageUrl').validate(isUrl);
AppSchema.path('contactEmail').validate(isEmail);

AppSchema.statics.sanitize = function(json: any, extended: boolean) : void {
    delete json._id;
    if (extended) {
        delete json.baseUrl;
    }
}

AppSchema.statics.verifyContent = async function(id: string, content: any, log: Log): Promise<VerifyHelper> {
        let app: IApp | null = null;
        let data: any | null = null;
        try {
            app = await App.findById(id);
        } catch (e) {
            log.error(e.message);
            return new VerifyHelper(app, data);
        }

        if (!app) {
            log.warn("Could not find app");
            return new VerifyHelper(app, data);
        }

        data = await utils.decryptContent(app.cert, content);
        if (data === undefined) {
            log.warn("Could not verify");
        }
        return new VerifyHelper(app, data);
}

const App: IAppStatic = mongoose.model<IApp, IAppStatic>("App", AppSchema);
export default App;
