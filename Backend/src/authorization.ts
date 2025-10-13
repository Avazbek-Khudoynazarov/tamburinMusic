import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from './config';

const checkToken = (accessToken: string) => {
    try {
        if(accessToken == undefined || accessToken == "") {
            return "";
        }

        const secret_key = config.jwtSecretKey;

        //토큰을 검증한다.
        const decoded: any = jwt.verify(accessToken, secret_key!);
        
        if (decoded) {
            return decoded.id;
        } else {
            return "";
        }
    } catch (err) {
        //token expired
        return "";
    }
};

const verifyToken = (request: Request, response: Response, next: NextFunction) => {
    try {
        if(!request.headers['authorization']) {
            return response.status(403).json({
                success: false,
                message: 'not logged in'
            })
        }

        //const token: string = request.headers['authorization'].toString();
        const token = request.headers['authorization'].toString().split('Bearer ')[1];
        const secret_key = config.jwtSecretKey;
        
        // token does not exist
        if(!token) {
            return response.status(403).json({
                success: false,
                message: 'not logged in'
            })
        }

        //토큰을 검증한다.
        const decoded: any = jwt.verify(token, secret_key!);
        
        if (decoded) {
            response.locals = {
                ...response.locals,
                id: decoded.id,
                type: decoded.type,
            }
            next();
        } else {
            response.status(401).json({ error: 'unauthorized' });
        }
    } catch (err) {
        response.status(401).json({ error: 'token expired' });
    }
};

export { verifyToken, checkToken };
