import express, {Request, Response}  from "express";
import passport from 'passport';
const router = express.Router();

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });

router.get('/auth/facebook',
   passport.authenticate('facebook', {scope: ['profile'] }));

router.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req: Request, res: Response)=> {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
  });

export default module.exports = router;