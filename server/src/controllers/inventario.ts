import { Request, Response } from 'express';
import { Eliminar_inventario, Insertar_inventario, Mostrar_Inventario } from '../models/inventario';
//controller
export const newInventario = async (req:Request, res: Response) => {
    
    const {nombre_producto,cantidad,nombre_almacen} = req.body;

    try {
        await Insertar_inventario(nombre_producto,cantidad,nombre_almacen);
        res.json({
            msg:"inventario creado con exito"
        });
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error'+error,
            error
        })
    }
}

export const getInventarios = async (req:Request, res: Response) => {
    try {
        const listInventarios = await Mostrar_Inventario();
        res.json(listInventarios);
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error'+error,
            error
        })
    }
}

export const deleteInventario = async (req:Request, res: Response) => {
    
    const {cod} = req.params;
    const codigo_inventario = parseInt(cod,10); 
    try {
        await Eliminar_inventario(codigo_inventario);
        res.json({
            msg:"inventario eliminado con exito"
        });
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error'+error,
            error
        })
    }
}