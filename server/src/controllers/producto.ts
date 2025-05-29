import { Request, Response } from 'express';
import { Producto, callActualizarProducto, callCrearProducto, obtenerProductos } from '../models/producto';

//inserta un nuevo producto
export const newProducto = async (req:Request, res: Response) => {
    const {marca, categoria, stock, precio_compra, precio_venta, fecha_vencimiento} = req.body;
    try {
        await callCrearProducto(marca,categoria,stock,precio_compra,precio_venta,fecha_vencimiento);
        res.json({
            msg: `Producto Añadido`,
        })
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }
}

export const updateProducto = async (req:Request, res: Response) => {
    const {cod,marca, categoria, stock, precio_compra, precio_venta, fecha_vencimiento} = req.body;
    
    try {

        const product= await Producto.findByPk(cod);
        
        if(product){
            await callActualizarProducto(cod,marca,categoria,stock,precio_compra,precio_venta,fecha_vencimiento);
            res.json({
            msg: `Producto Actualizado`,
            })
        }else{
            res.status(404).json({
                msg: `No Existe un producto con el codigo ${cod}`,
            })
        }

    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }
}

export const deleteProduct = async (req:Request, res:Response) =>{
    const {cod}=req.params;
    const product = await Producto.findByPk(cod);
    try {
        if(!product){
            res.status(404).json({
                msg: `No Existe un producto con el codigo ${cod}`,
            })
        }else{
            await product.destroy();
            res.json({
                msg: 'El producto fue eliminado con exito!'
            })
        }
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }
}

export const getProducto = async (req:Request, res:Response) => {
    
    try {
        const listProduct = await obtenerProductos();
        //console.log(_listProduct);
        
        res.json(listProduct);
    } catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error '+error,
            error
        })
    }
}