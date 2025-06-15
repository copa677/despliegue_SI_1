export interface Factura{  
    codigo_factura?:number,
    ci_cliente:number
    nombre_cliente: string, 
    correo_cliente: string, 
    telefono_cliente:string,
    nombre_usuario: string, 
    metodo_pago_nombre: string, 
    fecha?:Date,
    total?:number,
    monto_descuento?:number
}