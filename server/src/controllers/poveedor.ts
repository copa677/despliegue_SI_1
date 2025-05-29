import { Request, Response } from 'express';
import { Proveedor } from '../models/proveedor';



export const getProveedores = async(req:Request,res: Response)=>{
    const listproveedor = await Proveedor.findAll()
    res.json(listproveedor);
}

export const getProveedor = async(req:Request,res: Response)=>{
    const { codigo } = req.params;
    const proveedor = await Proveedor.findByPk(codigo);

    if (proveedor) {
        res.json(proveedor)
    } else {
        res.status(404).json({
            msg: `No existe un proveedor con el id ${codigo}`
        })
    }
}

export const deleteProveedor = async(req:Request,res: Response)=>{
    const { codigo } = req.params;
    console.log(codigo);
    
    const proveedor = await Proveedor.findByPk(codigo);
    try {
        if (!proveedor) {
            res.status(404).json({
                msg: `No existe un proveedor con el id ${codigo}`
            })
        } else {
            await proveedor.destroy();
            res.json({
                msg: 'El proveedor fue eliminado con exito!'
            })
        }
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }
}

export const newProveedor = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await Proveedor.create(body);

        res.json({
            msg: `El proveedor fue agregado con exito!`
        })
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }
}


export const updateProveedor = async (req: Request, res: Response) => {
    const { body } = req;
    const { codigo } = req.params;

    try {

        const proveedor = await Proveedor.findByPk(codigo);

    if(proveedor) {
        await proveedor.update(body);
        res.json({
            msg: 'El proveedor fue actualziado con exito'
        })

    } else {
        res.status(404).json({
            msg: `No existe un proveedor con el id ${codigo}`
        })
    }
        
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }

    
}