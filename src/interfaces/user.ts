export interface Iuser extends Document {
    id: string;
    username: string,
    email: string,
    password: string,
    googleId?: string,
    profilepicture?: string,
    name?: string,
    createdAt:Date,
    updatedAt: Date
}
export interface User {
    email?: string,
    id: string,
    name?:string
}