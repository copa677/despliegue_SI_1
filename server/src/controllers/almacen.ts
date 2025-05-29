import { Request, Response } from 'express';
import { Almacen } from '../models/almacen';
//controller
export const getAlamcenes = async(req:Request,res: Response)=>{
    const listalamcen = await Almacen.findAll()
    res.json(listalamcen);
}

export const getAlmacen = async(req:Request,res: Response)=>{
    const { id } = req.params;
    const alamcen = await Almacen.findByPk(id);

    if (alamcen) {
        res.json(alamcen)
    } else {
        res.status(404).json({
            msg: `No existe un almacen con el id ${id}`
        })
    }
}

export const deleteAlamcen = async(req:Request,res: Response)=>{
    const { id } = req.params;
    console.log(id);
    
    const alamcen = await Almacen.findByPk(id);
    try {
        if (!alamcen) {
            res.status(404).json({
                msg: `No existe un proveedor con el id ${id}`
            })
        } else {
            await alamcen.destroy();
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

export const newAlmacen = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await Almacen.create(body);

        res.json({
            msg: `El Alamacen fue agregado con exito!`
        })
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }
}


export const updateAlamcen = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {

        const alamcen = await Almacen.findByPk(id);

    if(alamcen) {
        await alamcen.update(body);
        res.json({
            msg: 'El alamcen fue actualziado con exito'
        })

    } else {
        res.status(404).json({
            msg: `No existe un almacen con el id ${id}`
        })
    }
        
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }

    
}