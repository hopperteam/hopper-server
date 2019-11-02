import * as mongoose from 'mongoose';

interface IApp extends mongoose.Document {
    name: string;
    imageUrl: string;
    isHidden: boolean;
    baseUrl: string;
    manageUrl: string | undefined;
    cert: string;
}

const AppSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    baseUrl: { type: String, required: true },
    manageUrl: { type: String },
    cert: { type: String, required: true }
}, {
    versionKey: false // set to true to keep track of version of document
});

const App = mongoose.model<IApp>("App", AppSchema);
export default App;
