import * as mongoose from 'mongoose';
import Action from './action';

interface INotification extends mongoose.Document {
    userId: string;
    heading: string;
    serviceProvider: string;
    timestamp: number;
    imageUrl: string;
    isDone: false;
    isSilent: boolean;
    isArchived: boolean;
    type: string;
    content: string;
    actions: any[];
}

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    heading: { type: String, required: true },
    serviceProvider: { type: String, required: true },
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

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
