export interface Iuser extends Document {
    id: string;
    username: string,
    email: string,
    password: string,
    googleId?: string,
    profilepicture?: string,
    name?: string,
    createdAt:Date,
    updatedAt: Date,
    resetPasswordToken?: string,
  resetPasswordExpires?: Date
}
export interface User {
    email?: string,
    id: string,
    name?:string
}
export interface registerRequestBody {
    email: string,
    password: string,
}
export interface loginRequestBody {
    email: string,
    password: string
}
export interface updateUserRequestBody {
    email: string,
    password: string
}
export interface changePasswordRequestBody {
    oldPassword: string,
    newPassword: string,
}