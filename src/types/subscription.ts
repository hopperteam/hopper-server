import * as mongoose from 'mongoose';
import ISanitizer from './sanitizer';

export interface ISubscription extends mongoose.Document {
    userId: any;
    accountName: string | undefined;
    app: any;
}

// interface extending sanitizer
interface ISubscriptionStatic extends mongoose.Model<ISubscription>, ISanitizer {
    // other static methods
}

const SubscriptionSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    accountName: { type: String },
    app: { type: mongoose.Types.ObjectId, ref: 'App', required: true }
}, {
    versionKey: false // set to true to keep track of version of document
});

SubscriptionSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) { 
        delete ret._id;
        delete ret.userId;
    }
});

// currently not used because object for db is explicitly created
SubscriptionSchema.statics.sanitize = function(json: any, extended: boolean) : void {
    delete json._id;
}

const Subscription: ISubscriptionStatic = mongoose.model<ISubscription, ISubscriptionStatic>("Subscription", SubscriptionSchema);
export default Subscription;
