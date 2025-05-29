import { Request, Response } from 'express';
import { callNuevaBitacora, obtenerBitacoras } from '../models/bitacora';
//me crea una bitacora
export const newBitacora = async (req:Request, res: Response) => {
    const {nombre_usuario,ip,fechahora,descripcion} = req.body;  
    try {
        await callNuevaBitacora(nombre_usuario,ip,fechahora,descripcion);
        res.json({
            msg: `Bitacora Añadida`,
        })
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error',
            error
        })
    }
}

export const getBitacora = async (req:Request, res:Response) => {
    try {
        const listBitacora = await obtenerBitacoras();
        res.json(listBitacora);
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error',
            error
        })
    }
}