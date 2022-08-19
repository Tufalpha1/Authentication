"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const User = require('../models/user');
const router = express_1.default.Router();
router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', (req, res) => {
    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/register');
        }
        else {
            passport_1.default.authenticate('local')(req, res, () => {
                res.redirect('secrets');
            });
        }
    });
});
exports.default = module.exports = router;
