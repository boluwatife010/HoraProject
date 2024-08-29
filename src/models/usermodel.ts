import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { Iuser } from '../interfaces/user';
const userSchema: Schema<Iuser> = new Schema({
    email: {type: String, 
        required:  [true, 'Your email is required'],
        unique: true, 
        validate: [validator.isEmail, 'This is not a valid email.'],
        lowercase: true
    },
    password: {type: String,
        required: [true, 'Your password is required'],
        bcrypt: true,
        minlength: [6, 'Your minimum length of character is 6.'],
        rounds: 10},
        username: {type: String,
            required: [true, 'Your username is required'],
            min:3, 
            max: 20
        },
    googleId: {type: String},
    name: {type: String},
    profilepicture: {type:String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
})
export const userModel = mongoose.model('User', userSchema);