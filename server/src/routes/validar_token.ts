import { Request,Response,NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const validar_token = (req: Request, res: Response, next: NextFunction) =>{
    const headerToken = req.headers['authorization']
    
    if(headerToken != undefined && headerToken.startsWith('Bearer ')){
        //tiene tokken

        try {
            const bearerToken = headerToken.slice(7);
            console.log(bearerToken);
            jwt.verify(bearerToken,process.env.SECRET_KEY || 'SuperPutz');
            next()
        } catch (error) {
            res.status(401).json({
                msg: 'Token no valido'
            })
        }

        
    }else{
        res.status(401).json({
            msg: 'Acceso denegado'
        })
    }
}

export default validar_token;