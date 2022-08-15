import express, {Request, Response}  from "express";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.render('home');
});

export default module.exports = router;