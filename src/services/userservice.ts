import { userModel } from "src/models/usermodel";
import { registerRequestBody, loginRequestBody, updateUserRequestBody} from "src/interfaces/user";
import { generateAuthToken } from "src/auth/auth";
import bcrypt from 'bcryptjs';
import { Error } from "mongoose";

export const registerUser = async (body: registerRequestBody):Promise <any> => {
    const {email, password} = body;
    const existingUser = await userModel.findOne({email});
    if (existingUser) {
        throw new Error ('This email is already in use!')
    }
    const hashPassord = await bcrypt.hash(password, 10);
    const createUser = await userModel.create({email, password:hashPassord});
    const token = generateAuthToken(createUser._id.toString());
    if (!createUser) {
        throw new Error ('Please validate your details above')
    }
    await createUser.save();
    return {createUser, token}
}
export const loginUser = async (body: loginRequestBody) => {
    const {email, password} = body;
    const login = await userModel.findOne({email})
    if (!login) {
        throw new Error ('Could not log the user in')
    }
    const comparing = await bcrypt.compare(password, login.password);
    if (!comparing) {
        throw new Error ('Invalid password used.')
    }
    const token = generateAuthToken(login._id.toString());
    return {login, token};
}
export const updateUser = async (body: updateUserRequestBody, id: string) => {
    const {email, password} =  body;
    const update = await userModel.findById(id);
    if (!update) {
        throw new Error ('Please provide a valid id');
    }
    if (email) {
        update.email = email
    }
    if (password) {
        update.password = await bcrypt.hash(password, 10);
        
    }
   await update.save();
   return update

}
export const getUser = async (id: string) => {
    const user = await userModel.findById(id);
    if (!user) {
        throw new Error ('User not found.')
    }
    return user;
}
export const getAllUsers = async () => {
    const all = await userModel.find();
    if (!all) {
        throw new Error ('Could not get all users.')
    }
    return all;
}
export const deleteUser = async (id: string) => {
    const deleting = await userModel.findByIdAndDelete(id);
    if (!deleting) {
        throw new Error ('The id provided above is not valid.')
    }
    return deleting;
}