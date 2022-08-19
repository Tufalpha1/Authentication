"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const home_1 = __importDefault(require("./routes/home"));
const oauth_1 = __importDefault(require("./routes/oauth"));
const login_1 = __importDefault(require("./routes/login"));
const register_1 = __importDefault(require("./routes/register"));
const submit_1 = __importDefault(require("./routes/submit"));
const logout_1 = __importDefault(require("./routes/logout"));
const secrets_1 = __importDefault(require("./routes/secrets"));
const User = require('./models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
//use the session package and set it up with some initial configuration
app.use((0, express_session_1.default)({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));
//middlewares
app.use(passport_1.default.initialize()); //use passport and initialize it
app.use(passport_1.default.session()); //use passport with the session
//connecting to the database
mongoose_1.default.connect('mongodb://localhost:27017/userDB')
    .then((result) => {
    console.log('Connected to the database');
})
    .catch((err) => {
    console.log(err);
});
passport_1.default.use(User.createStrategy());
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
//google strategy
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/secrets',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}, (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ username: profile.displayName, googleId: profile.id }, (err, user) => {
        return cb(err, user);
    });
}));
//facebook strategy
passport_1.default.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
}, function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ username: profile.displayName, facebookId: profile.id }, (err, user) => {
        return cb(err, user);
    });
}));
//home routes
app.use(home_1.default);
//oauth routes
app.use(oauth_1.default);
//secrets routes
app.use(secrets_1.default);
//login routes
app.use(login_1.default);
//register routes
app.use(register_1.default);
//submit routes
app.use(submit_1.default);
//logout routes
app.use(logout_1.default);
app.listen(3000, () => {
    console.log('Server started running on port 3000');
});
