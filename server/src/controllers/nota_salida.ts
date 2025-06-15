import { Request, Response } from 'express';
import { Actulizar_detalle_salida, Eliminar_detalle_salida, Eliminar_nota_salida, Insertar_detalle_salida, Mostrar_detalle_nota_salida, NotaSalida, Actulizar_nota_salida, Eliminar_notas_vacias } from '../models/nota_salida';
import { format as formatDate } from 'date-fns';
import { toZonedTime, format } from 'date-fns-tz';

export const newNotaSalida = async (req: Request, res: Response) => {
    const { body } = req;
    const boliviaTimeZone = 'America/La_Paz';
    const now = new Date();
    // Convertir la fecha actual a la zona horaria de Bolivia
    const zonedDate = toZonedTime(now, boliviaTimeZone);

    // Formatear la fecha en el formato deseado
    const formattedDate = format(zonedDate, 'yyyy-MM-dd', { timeZone: boliviaTimeZone });
    
    // Reemplazar la fecha en el cuerpo de la solicitud con la fecha ajustada
    body.fecha = formattedDate;

    try {
        const notaSalida = await NotaSalida.create(body);
        const cod = notaSalida.getDataValue('cod');
        res.json(cod);
    } catch (error:any) {
        console.log(error);
        res.json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        });
    }
}

// Sigue asegurándote de que los otros métodos manejen las fechas correctamente si es necesario.

// Incluye tus otros métodos aquí de manera similar, y asegúrate de que manejan fechas correctamente si es necesario

export const getNotas_de_Salida = async(req:Request,res: Response)=>{
    const listNsalida = await NotaSalida.findAll()
    res.json(listNsalida);
}

export const getNota_Salida = async(req:Request,res: Response)=>{
    const { cod } = req.params;
    const NSalida = await NotaSalida.findByPk(cod);

    if (NSalida) {
        res.json(NSalida)
    } else {
        res.status(404).json({
            msg: `No existe un almacen con el id ${cod}`
        })
    }
}

export const deleteNota_Salida = async (req:Request, res: Response) => {
    
    const {cod} = req.params;
    const codigo_NotaS = parseInt(cod,10); 
    try {
        await Eliminar_nota_salida(codigo_NotaS);
        res.json({
            msg:"Nota de Salida eliminada con exito"
        });
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }   
}

export const updateNota_Salida = async (req: Request, res: Response) => {
    const {cod} = req.params;
    const NSalida = parseInt(cod,10);
    const {origen,descripcion,fecha } = req.body;

    try {
        await Actulizar_nota_salida(NSalida,fecha,origen,descripcion);
        res.json({
            msg:"Nota de salida actualizado con exito"
        });
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const newDetalleSalida = async (req:Request, res: Response) => {
    
    const {cod_salida,nombre_producto,cantidad} = req.body;
    console.log(cod_salida);
    
    try {
        await Insertar_detalle_salida(cod_salida,nombre_producto,cantidad);
        res.json({
            msg:"Detalle de salida creado con exito"
        });
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const updateDetalleSalida = async (req:Request, res: Response) => {
    const {cod_detalle,nombre_producto,cantidad} = req.body;

    try {
        await Actulizar_detalle_salida(cod_detalle,nombre_producto,cantidad);
        res.json({
            msg:"Detalle de salida actualizado con exito"
        });
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const deleteDetalleSalida = async (req:Request, res: Response) => {
    const {cod} = req.params;
    const codigo_Detalle = parseInt(cod,10); 
    try {
        await Eliminar_detalle_salida(codigo_Detalle);
        res.json({
            msg:"Detalle de Nota de Salida eliminada con exito"
        });
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }   
}

export const getDetalleSalida = async (req : Request, res : Response) => {
    const {cod} = req.params;
    const codigo_Salida = parseInt(cod,10); 
    try {
        const listDetSalida = await Mostrar_detalle_nota_salida(codigo_Salida);
        res.json(listDetSalida);
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const deletNotasVacias = async (req:Request, res: Response) => {
    try {
        await Eliminar_notas_vacias();
        res.json({
            msg:"Notas Eliminadas"
        });
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}
