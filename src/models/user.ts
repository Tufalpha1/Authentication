import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
    });

//using schema plugins
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

export default module.exports = mongoose.model('User', userSchema);;
