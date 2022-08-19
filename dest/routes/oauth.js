"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
router.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/secrets', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
});
router.get('/auth/facebook', passport_1.default.authenticate('facebook', { scope: ['profile'] }));
router.get('/auth/facebook/secrets', passport_1.default.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect secrets.
    res.redirect('/secrets');
});
exports.default = module.exports = router;
