export interface DetalleFactura{  
    cod?:number,
    codigo_factura:number
    categoria_producto_nombre: string, 
    cantidad_producto: number,
    precio_unitario?: string,
    importe?:string,
}