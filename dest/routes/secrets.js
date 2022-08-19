"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User = require('../models/user');
const router = express_1.default.Router();
router.get('/secrets', (req, res) => {
    User.find({ 'secret': { $ne: null } }, (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
                res.render('secrets', { usersWithSecrets: foundUser });
            }
        }
    });
});
exports.default = module.exports = router;
