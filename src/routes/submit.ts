import express, {Request, Response}  from "express";
import passport from 'passport';
const User = require('../models/user');
const router = express.Router();

router.get('/submit', (req: Request, res: Response) => {
    if(req.isAuthenticated()){
        res.render('submit');
    }else{
        res.redirect('/login');
    }
});

router.post('/submit', (req: Request, res: Response) => {
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

export default module.exports = router;