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
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
//use the session package and set it up with some initial configuration
app.use((0, express_session_1.default)({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize()); //use passport and initialize it
app.use(passport_1.default.session()); //use passport with the session
mongoose_1.default.connect('mongodb://localhost:27017/userDB');
const userSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});
userSchema.plugin(passport_local_mongoose_1.default);
userSchema.plugin(findOrCreate);
const User = mongoose_1.default.model('User', userSchema);
passport_1.default.use(User.createStrategy());
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
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
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/secrets', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
});
app.get('/secrets', (req, res) => {
    User.find({ 'secret': { $ne: null } }, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
                res.render('secrets', { usersWithSecrets: foundUser });
            }
        }
    });
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            passport_1.default.authenticate('local')(req, res, () => {
                res.redirect('secrets');
            });
        }
    });
});
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/register');
        }
        else {
            passport_1.default.authenticate('local')(req, res, () => {
                res.redirect('secrets');
            });
        }
    });
});
app.get('/submit', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('submit');
    }
    else {
        res.redirect('/login');
    }
});
app.post('/submit', (req, res) => {
    const submittedText = req.body.secret;
    User.findById(req.user?.id, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
                foundUser.secret = submittedText;
                foundUser.save(() => {
                    res.redirect('/secrets');
                });
            }
        }
    });
});
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});
app.listen(3000, () => {
    console.log('Server started running on port 3000');
});
