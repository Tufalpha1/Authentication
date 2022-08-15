import 'dotenv/config'
import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import homeRoute from './routes/home';
import loginRoute from './routes/login';
import registerRoute from './routes/register';
import submitRoute from './routes/submit';
import logoutRoute from './routes/logout';
import secretsRoute from './routes/secrets';
const User = require('./models/user');
const userSchema = require('./models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: true,
  }));

app.use(passport.initialize()); //use passport and initialize it
app.use(passport.session());   //use passport with the session

mongoose.connect('mongodb://localhost:27017/userDB')
.then((result)=>{
    console.log('Connected to the database');
})
.catch((err)=>{
    console.log(err);
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


passport.use(User.createStrategy());

passport.serializeUser((user, done)=> {
    done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  User.findById(id, (err: any, user: any)=> {
    done(err, user);
  });
});

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

//home routes
app.use(homeRoute);

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });

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