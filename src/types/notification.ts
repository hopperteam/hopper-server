import * as mongoose from 'mongoose';
import ISanitizer from './sanitizer';
import Action from './action';

export interface INotification extends mongoose.Document {
    userId: string;
    heading: string;
    subscription: string;
    timestamp: number;
    imageUrl: string;
    isDone: false;
    isSilent: boolean;
    isArchived: boolean;
    type: string;
    content: string;
    actions: Action[];
}

// interface extending sanitizer
interface INotificationStatic extends mongoose.Model<INotification>, ISanitizer {
    // other static methods
}

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    heading: { type: String, required: true },
    subscription: { type: String, required: true },
    timestamp: { type: Number, required: true },
    imageUrl: { type: String },
    isDone: { type: Boolean, default: false },
    isSilent: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    type: { type: String, required: true },
    content: { type: String, required: true },
    actions: [{
        type: { type: String, required: true },
        url: { type: String, required: true },
        markAsDone: { type: Boolean, default: false },
        text: { type: String, required: true }
    }]
}, {
    versionKey: false // set to true to keep track of version of document
});

NotificationSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.isArchived;
        delete ret.userId;
        ret.actions.forEach((action: any, index: number) => {
            ret.actions[index] = Action.fromDbJson(action);
        });
    }
});

NotificationSchema.statics.sanitize = function(json: any, extended: boolean) : void {
    delete json._id;
    delete json.subscription;
    delete json.isArchived;
    if (json.actions !== undefined) {
        json.actions.forEach((action: any, index: number) => {
            json.actions[index] = Action.fromRequestJson(action);
        });
    }
}

const Notification: INotificationStatic = mongoose.model<INotification, INotificationStatic>("Notification", NotificationSchema);
export default Notification;
