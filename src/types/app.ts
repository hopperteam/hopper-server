import * as mongoose from 'mongoose';
import ISanitizer from './sanitizer';
import { isUrl, isEmail } from '../utils';

interface IApp extends mongoose.Document {
    name: string;
    imageUrl: string;
    isHidden: boolean;
    baseUrl: string;
    manageUrl: string | undefined;
    contactEmail: string;
    cert: string;
}

// interface extending sanitizer
interface IAppStatic extends mongoose.Model<IApp>, ISanitizer {
    // other static methods
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

const App: IAppStatic = mongoose.model<IApp, IAppStatic>("App", AppSchema);
export default App;
