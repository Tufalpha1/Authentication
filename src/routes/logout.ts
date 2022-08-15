import express, {Request, Response}  from "express";
const router = express.Router();

router.get('/logout', (req: Request, res: Response) => {
    req.logout((err) => {
        if(err){
            console.log(err);
        } 
        res.redirect('/');
    });
});

export default module.exports = router;