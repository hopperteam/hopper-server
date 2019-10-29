import * as mongoose from 'mongoose';

interface ISession extends mongoose.Document {
    userId: string;
    expTs: string;
}

const SessionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    expTs: { type: Number, required: true }
}, {
    versionKey: false // set to true to keep track of version of document
});

const Session = mongoose.model<ISession>("Session", SessionSchema);
export default Session;
