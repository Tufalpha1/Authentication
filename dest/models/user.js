"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});
//using schema plugins
userSchema.plugin(passport_local_mongoose_1.default);
userSchema.plugin(findOrCreate);
exports.default = module.exports = mongoose_1.default.model('User', userSchema);
;
