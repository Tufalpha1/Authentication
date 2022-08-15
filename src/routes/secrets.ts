import express, {Request, Response}  from "express";
const User = require('../models/user');
const router = express.Router();

router.get('/secrets', (req: Request, res: Response) => { 
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

export default module.exports = router;