"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    email: { type: String,
        required: function () {
            return !this.googleId;
        },
        unique: true,
        validate: [validator_1.default.isEmail, 'This is not a valid email.'],
        lowercase: true
    },
    password: { type: String,
        required: function () {
            return !this.googleId;
        },
        bcrypt: true,
        minlength: [6, 'Your minimum length of character is 6.'],
        rounds: 10 },
    // username: {type: String,
    //     required: function () {
    //         return !this.googleId
    //     },
    //     min:[3, 'Your username should be 3 characters long.'], 
    //     max: [20, 'Your useername should  be less than 20 characters.']
    // },
    googleId: { type: String },
    name: { type: String },
    profilepicture: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    points: { type: Number, default: 100 },
    dailyCompletedTasks: { type: Number, default: 0 },
    onetime: { type: String, required: false },
    otpExpires: { type: Date, required: false },
    isVerified: { type: Boolean, required: false }
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = function (password) {
    return bcryptjs_1.default.compare(password, this.password);
};
userSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.userModel = mongoose_1.default.model('User', userSchema);
