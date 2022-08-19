"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const User = require('../models/user');
const router = express_1.default.Router();
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            passport_1.default.authenticate('local')(req, res, () => {
                res.redirect('secrets');
            });
        }
    });
});
exports.default = module.exports = router;
