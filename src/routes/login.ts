import express, {Request, Response}  from "express";
import passport from 'passport';
const User = require('../models/user');
const router = express.Router();

router.get('/login', (req: Request, res: Response) => {
    res.render('login');
});

router.post('/login',(req: Request, res: Response) => {
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

export default module.exports = router;