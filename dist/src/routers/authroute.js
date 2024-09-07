"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const auth_1 = require("../auth/auth");
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), auth_1.handleGoogleCallback);
router.get('/logout', auth_1.logout);
router.get('/dashboard', auth_1.isAuthenticated, (req, res) => {
    res.send('Welcome to your dashboard!');
});
exports.default = router;
