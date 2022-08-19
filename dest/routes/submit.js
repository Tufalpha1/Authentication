"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User = require('../models/user');
const router = express_1.default.Router();
router.get('/submit', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('submit');
    }
    else {
        res.redirect('/login');
    }
});
router.post('/submit', (req, res) => {
    const submittedText = req.body.secret;
    User.findById(req.user?.id, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
                foundUser.secret = submittedText;
                foundUser.save(() => {
                    res.redirect('/secrets');
                });
            }
        }
    });
});
exports.default = module.exports = router;
