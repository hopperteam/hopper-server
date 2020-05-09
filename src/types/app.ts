import * as mongoose from 'mongoose';
import validator from 'validator';

interface IApp extends mongoose.Document {
    name: string;
    imageUrl: string;
    isHidden: boolean;
    baseUrl: string;
    manageUrl: string | undefined;
    contactEmail: string;
    cert: string;
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
    transform: function (doc, ret) { delete ret._id }
});

// Validators
AppSchema.path('imageUrl').validate(function(imageUrl: string){
    return validator.isURL(imageUrl, {
        require_protocol: true,
        protocols: ['https']
    });
});
AppSchema.path('baseUrl').validate(function(baseUrl: string){
    return validator.isURL(baseUrl, {
        require_protocol: true,
        protocols: ['https']
    });
});
AppSchema.path('manageUrl').validate(function(manageUrl: string){
    return validator.isURL(manageUrl, {
        require_protocol: true,
        protocols: ['https']
    });
});
AppSchema.path('contactEmail').validate(function(contactEmail: string){
    return validator.isEmail(contactEmail);
});

const App = mongoose.model<IApp>("App", AppSchema);
export default App;
