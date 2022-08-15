import mongoose from "mongoose";
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
    });

 module.exports = mongoose.model('User', userSchema);;
