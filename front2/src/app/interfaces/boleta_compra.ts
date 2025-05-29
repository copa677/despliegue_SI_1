export interface Boleta_Compra{  
    nroboleta?:number,
    nombre_proveedor: string,
    nombre_administrador: string, 
    metodo_pago_nombre: string,
    descripcion: string,
    total?: number, 
    fecha?: Date,
}