import * as mongoose from 'mongoose';

interface ISubscription extends mongoose.Document {
    userId: any;
    accountName: string | undefined;
    app: any;
}

const SubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, index: true },
    accountName: { type: String },
    app: { type: mongoose.Types.ObjectId, ref: 'App', required: true }
}, {
    versionKey: false // set to true to keep track of version of document
});

const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
export default Subscription;
