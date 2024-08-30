import jwt,{ Secret} from 'jsonwebtoken';
import express from 'express';
import { Iuser, User } from '../interfaces/user';
require('dotenv').config();
export const generateAuthToken = (userId: string): string => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET as Secret, {expiresIn: '30d'});
    return token;
}
export const verifyAuthToken =  (token: string): any => {
    try {
        const decode =jwt.verify(token, process.env.JWT_SECRET as Secret)
        return decode;
    }   catch (err) {
        throw new Error ('Invalid token inputed')
    }

}
export const authenticateToken = (req:express.Request, res: express.Response, next: express.NextFunction) =>  {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(400).send({message: 'Authentication is required.'})
    };
    try {
        const tokenString = Array.isArray(token) ? token[0] : token;
        const decoded = verifyAuthToken(tokenString.replace('Bearer', '').trim());
        (req as any).user = decoded;
        next();
    }   catch (err) {
        return res.status(401).send({message: 'Invalid token'})
    }

}
 export const handleGoogleCallback = (req: express.Request, res: express.Response) => {
  const user = req.user as User;
  if (!user) {
    return res.status(401).send({ message: 'User not authenticated' });
  }
  const token = generateAuthToken(user._id .toString());
  const frontendUrl = process.env.FRONTEND_URL;
if (frontendUrl) {
    res.redirect(`${frontendUrl}/success?token=${token}`);
  } else {
    res.send({
      message: 'Successfully logged in with Google!',
      user,
      token,
    });
  }
};
export const logout = (req: express.Request, res:express.Response) => {
  res.clearCookie('token');
  res.redirect('/login'); 
};
export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
    }
    res.redirect('/login'); 
};
