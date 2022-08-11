import 'dotenv/config'
import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
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

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
email: String,
password: String,
googleId: String,
secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User: any = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err: any, user: any) {
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

app.get('/', (req: Request, res: Response) => {
    res.render('home');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });

app.get('/secrets', (req: Request, res: Response) => { 
    User.find({'secret': {$ne: null}}, (err: any, foundUser: any) => {
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                res.render('secrets', {usersWithSecrets: foundUser});
            }
        }
    });
});

app.get('/login', (req: Request, res: Response) => {
    res.render('login');
});

app.post('/login',(req: Request, res: Response) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, (err) => {
        if(err){
            console.log(err);
        }else{
            passport.authenticate('local')(req, res, () => {
                res.redirect('secrets');
            });
        }
    });
});


app.get('/register', (req: Request, res: Response) => {
    res.render('register');
});

app.post('/register', (req: Request, res: Response) => {

    User.register({username: req.body.username}, req.body.password, (err: any, user: any) => {
    if(err){
        console.log(err);
        res.redirect('/register');
    }else{
        passport.authenticate('local')(req, res, () => {
            res.redirect('secrets');
        });
    }   
    });  
});

app.get('/submit', (req: Request, res: Response) => {
    if(req.isAuthenticated()){
        res.render('submit');
    }else{
        res.redirect('/login');
    }
});

app.post('/submit', (req: Request, res: Response) => {
    const submittedText = req.body.secret;
    User.findById(req.user?.id, (err: any, foundUser: any) =>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                foundUser.secret = submittedText;
                foundUser.save(() => {
                    res.redirect('/secrets');
                });
            }
        }
    });
});

app.get('/logout', (req: Request, res: Response) => {
    req.logout((err) => {
        if(err){
            console.log(err);
        } 
        res.redirect('/');
    });
});

app.listen(3000, ()=>{
    console.log('Server started running on port 3000');
});