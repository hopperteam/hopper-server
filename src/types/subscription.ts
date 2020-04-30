﻿import * as mongoose from 'mongoose';

export interface ISubscription extends mongoose.Document {
    userId: any;
    accountName: string | undefined;
    app: any;
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
    transform: function (doc, ret) { delete ret._id }
});

const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
export default Subscription;
