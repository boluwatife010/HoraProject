import jwt,{ Secret} from 'jsonwebtoken';
import express from 'express';
import { User } from '../interfaces/user';
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
export const handleGoogleCallback = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = req.user as User;
  
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
  
    try {
      const token = generateAuthToken(user.id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
        sameSite: 'strict' 
      
      })}   catch (error) {
        next(error); 
      }
    }
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
