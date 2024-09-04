import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs'
import { Iuser } from '../interfaces/user';
const userSchema: Schema<Iuser> = new Schema({
    email: {type: String, 
        required: function() {
            return !this.googleId
        },
        unique: true, 
        validate: [validator.isEmail, 'This is not a valid email.'],
        lowercase: true
    },
    password: {type: String,
        required: function () {
            return !this.googleId
        },
        bcrypt: true,
        minlength: [6, 'Your minimum length of character is 6.'],
        rounds: 10},
        // username: {type: String,
        //     required: function () {
        //         return !this.googleId
        //     },
        //     min:[3, 'Your username should be 3 characters long.'], 
        //     max: [20, 'Your useername should  be less than 20 characters.']
        // },
    googleId: {type: String},
    name: {type: String},
    profilepicture: {type:String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    points: { type: Number, default: 100 },
    dailyCompletedTasks: { type: Number, default: 0 }
})
userSchema.pre<Iuser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  };
  userSchema.pre<Iuser>('save', function (next) {
    this.updatedAt = new Date();
    next();
  });
export const userModel = mongoose.model<Iuser>('User', userSchema);