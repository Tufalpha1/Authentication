import express, {Request, Response}  from "express";
import passport from 'passport';
const User = require('../models/user');
const router = express.Router();

router.get('/register', (req: Request, res: Response) => {
    res.render('register');
});

router.post('/register', (req: Request, res: Response) => {

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

export default module.exports = router;