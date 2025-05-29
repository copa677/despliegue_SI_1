export interface Product{ 
    cod?:number,
    categoria: string, 
    marca: string,
    stock: number, 
    precio_compra: number, 
    precio_venta: number, 
    fecha_vencimiento: Date|null
}