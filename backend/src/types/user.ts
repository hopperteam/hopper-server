import * as mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
}, {
    versionKey: false // set to true to keep track of version of document
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
