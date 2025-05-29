import { Request, Response } from 'express';
import { Mostrar_Boletas_Compra, eliminar_Boleta_Compra, get_Boleta_Compra, get_Detalles_Boleta_Compra, insertar_Boleta_Compra, insertar_Detalle_Boleta_Compra } from '../models/boleta_compra';
import { format, toZonedTime } from 'date-fns-tz';

//controladores
export const newBoletaCompra = async (req:Request, res: Response) => {

    const boliviaTimeZone = 'America/La_Paz';
    const now = new Date();
    // Convertir la fecha actual a la zona horaria de Bolivia
    const zonedDate = toZonedTime(now, boliviaTimeZone);

    // Formatear la fecha en el formato deseado
    const formattedDate = format(zonedDate, 'yyyy-MM-dd', { timeZone: boliviaTimeZone });

    const {nombre_proveedor, nombre_administrador, metodo_pago_nombre, descripcion} = req.body;

    try {
        const codBoleta = await insertar_Boleta_Compra(nombre_proveedor, nombre_administrador, metodo_pago_nombre, descripcion, formattedDate);
        res.json(codBoleta)
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }
}

export const mostrar_boletas_compra = async (req : Request, res : Response) => {
    try {
        const listBoletas = await Mostrar_Boletas_Compra();
        res.json(listBoletas);
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const getBoleta_Compra = async (req : Request, res : Response) => {
    const {cod}=req.params
    const codigo_boleta = parseInt(cod,10); 
    try {
        const listBoleta: any[] = await get_Boleta_Compra(codigo_boleta);
        res.json(listBoleta);
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const deleteBoletaCompra = async (req : Request, res : Response) => {
    const {cod} = req.params;
    console.log(req.params);
    
    const codigo_Boleta= parseInt(cod,10);
    try {
        await eliminar_Boleta_Compra(codigo_Boleta);
        res.json({
            msg: `Boleta de Compra y Detalle de Boleta de compra eliminados`,
        })
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const newDetalleBoletaCompra = async (req:Request, res: Response) => {    

    console.log(req.body);
    
    const {NroBoleta, nombre_producto, cantidad, precio_unitario} = req.body;

    try {
        await insertar_Detalle_Boleta_Compra(NroBoleta, nombre_producto, cantidad, precio_unitario);
        res.json({
            msg: `Detalle de Boleta Añadida`,
        })
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }
}

export const getDetalles_Boleta_Compra = async (req : Request, res : Response) => {
    const {cod}=req.params
    const codigo_boleta = parseInt(cod,10); 
    try {
        const listBoleta: any[] = await get_Detalles_Boleta_Compra(codigo_boleta);
        res.json(listBoleta);
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}