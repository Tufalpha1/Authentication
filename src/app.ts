import 'dotenv/config'
import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import homeRoute from './routes/home';
import oauthRoute from './routes/oauth';
import loginRoute from './routes/login';
import registerRoute from './routes/register';
import submitRoute from './routes/submit';
import logoutRoute from './routes/logout';
import secretsRoute from './routes/secrets';
const User = require('./models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app: Application = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
declare global {
    namespace Express {
      interface User {
        id: string
      }
    }
  }
//use the session package and set it up with some initial configuration
app.use(session({
    secret: process.env.SECRET!, //non null assertation (this type will never be null or undefined)
    resave: false,
    saveUninitialized: true,
  }));

  //middlewares
app.use(passport.initialize()); //use passport and initialize it
app.use(passport.session());   //use passport with the session

//connecting to the database
mongoose.connect('mongodb://localhost:27017/userDB')
.then((result)=>{
    console.log('Connected to the database');
})
.catch((err)=>{
    console.log(err);
})


passport.use(User.createStrategy());

passport.serializeUser((user, done)=> {
    done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  User.findById(id, (err: any, user: any)=> {
    done(err, user);
  });
});

//google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/secrets',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  (accessToken: any, refreshToken: any, profile: any, cb: any) => {
    User.findOrCreate({ username: profile.displayName ,googleId: profile.id }, (err: any, user: any) => {
      return cb(err, user);
    });
  }
));
//facebook strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/secrets"
},
function(accessToken: any, refreshToken: any, profile: any, cb: any) {
  User.findOrCreate({ username: profile.displayName, facebookId: profile.id }, (err: any, user: any)=> {
    return cb(err, user);
  });
}
));

//home routes
app.use(homeRoute);

//oauth routes
app.use(oauthRoute);

//secrets routes
app.use(secretsRoute)

//login routes
app.use(loginRoute);

//register routes
app.use(registerRoute);

//submit routes
app.use(submitRoute);

//logout routes
app.use(logoutRoute);


app.listen(3000, ()=>{
    console.log('Server started running on port 3000');
});