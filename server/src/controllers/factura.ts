import { Request, Response } from 'express';
import { EliminarFactura, Mostrar_Clientes, Mostrar_Factura, getDetalleFactura, getFactura, insertar_detalle_factura, insertar_factura } from '../models/factura';
import { Factura } from '../models/factura';
import { Model, ModelCtor } from 'sequelize';


export const newFactura = async (req:Request, res: Response) => {

    const {ci_cliente,nombre_cliente, correo_cliente, telefono_cliente,nombre_usuario, metodo_pago_nombre,monto_descuento} = req.body;
    console.log(req.body);
    
    try {
        const codFac = await insertar_factura(ci_cliente,nombre_cliente, correo_cliente, telefono_cliente,nombre_usuario, metodo_pago_nombre,monto_descuento);
        res.json(codFac);
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }
}

export const detalle_factura = async (req:Request, res: Response) => {
    const {codigo_factura,categoria_producto_nombre, cantidad_producto} = req.body;
    try {
        await insertar_detalle_factura(codigo_factura,categoria_producto_nombre, cantidad_producto);
        res.json({
            msg: `Detalle de Factura Añadida`,
        })
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const mostrar_facturas = async (req : Request, res : Response) => {
    try {
        const listFactura = await Mostrar_Factura();
        res.json(listFactura);
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const getfactura = async (req : Request, res : Response) => {
    const {cod}=req.params
    const codigo_factura = parseInt(cod,10); 
    try {
        const listFactura: any[] = await getFactura(codigo_factura);
        res.json(listFactura);
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const getDetallefactura = async (req : Request, res : Response) => {
    const {cod}=req.params
    const codigo_factura = parseInt(cod,10);
    try {
        const listFactura = await getDetalleFactura(codigo_factura);
        res.json(listFactura);
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const deleteFactura = async (req : Request, res : Response) => {
    const {cod} = req.params;
    const codigo_factura= parseInt(cod,10);
    try {
        await EliminarFactura(codigo_factura);
        res.json({
            msg: `Factura y Detalle de Factura eliminada`,
        })
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}

export const mostrar_clientes = async (req : Request, res : Response) => {
    try {
        const listcliente = await Mostrar_Clientes();
        res.json(listcliente);
    } catch (error:any) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error.message,
            error: error.message
        })
    }
}