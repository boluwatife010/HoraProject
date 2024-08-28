import { loginUser, registerUser, getAllUsers, 
    getUser, deleteUser, updateUser } from "../services/userservice";
import express from 'express';

export const userRegistrationHandler = async (req:express.Request, res: express.Response) => {
    const {email, password, username} = req.body;
    try {
    if (!email || !password || !username) {
        return res.status(400).send({message: 'Please fill in the required fields.'});
    }
    const register = await registerUser({email, password});
    if (!register) {
        return res.status(400).send({message: 'Cross-check your details please.'});
    }
    return res.status(200).send({message: 'User successfully created.', register});
   }    catch (err) {
    console.log(err, 'Invalid err');
    return res.status(500).send({message: 'Internal server error.'});
   }
}
export const userLoginHandler = async (req: express.Request, res: express.Response) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send({message: 'Please fill in the required fields.'});
        }
        const login = await loginUser({email, password});
        if (!login) {
            return res.status(400).send({message: 'Could not find user with this details'});
        }
        return res.status(200).send({message: 'User successfully logged in', login});
    }   catch (err) {
        console.log(err, 'Invalid err')
        return res.status(500).send({message: 'Internal server error.'})
    }
}
export const updateUserHandler = async (req: express.Request, res: express.Response) => {
    const {email, password, username} = req.body;
    const {id} = req.params;
    try {
        if (!email || !password || !username) {
            return res.status(400).send({message: 'Please update one of the required fields.'});
        };
        const update = await updateUser({email, password}, id);
        if (!update) {
            return res.status(400).send({message: 'Could not update user.'});
        }
        return res.status(200).send({message: 'User successsfully updated', update});
    }   catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const getAUserHandler = async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    try {
        if (!id) {
            return res.status(400).send({message: 'Please provide a valid id.'});
        }
        const get = await getUser(id);
        if (!get) {
            return res.status(400).send({message: 'Could not get user by id.'})
        }
        return res.status(200).send({message: 'Successfully got a user', get});
    }    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const getAllUsersHandler = async (req: express.Request, res: express.Response) => {
    try {
        const allUsers = await getAllUsers();
        if (!allUsers) {
            return res.status(400).send({message: 'Could not get all users.'})
        }
        return res.status(200).send({message: 'Successfully got all users', allUsers});
    }    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}
export const deleteAUserHandler = async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    try {
        if (!id) {
            return res.status(400).send({message: 'Please provide a valid id.'});
        }
        const deleting = await deleteUser(id);
        if (!deleting) {
            return res.status(400).send({message: 'Could not delete user by id.'})
        }
        return res.status(200).send({message: 'Successfully deleted user.'});
    }    catch (err) {
        console.log(err, 'Invalid err');
        return res.status(500).send({message: 'Internal server error.'}); 
    }
}