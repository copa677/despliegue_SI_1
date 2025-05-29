import { DataType, DataTypes, DecimalDataType, INTEGER, IntegerDataType } from 'sequelize';
import sequelize from "../db/conexion";

export const Producto = sequelize.define('Producto', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'producto', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});

export async function callCrearProducto(marca: string, categoria: string, stock: IntegerDataType, precioCompra: DecimalDataType, precioVenta: DecimalDataType, fechaVencimineto: Date) {
    try {
      if(fechaVencimineto ==null){
        
        const [results, metadata] = await sequelize.query(
          `CALL crear_producto_sin_fecha('${marca}', '${categoria}', '${stock}', '${precioCompra}', '${precioVenta}')`
        );
      }else{
        const [results, metadata] = await sequelize.query(
          `CALL crear_producto('${marca}', '${categoria}', '${stock}', '${precioCompra}', '${precioVenta}', '${fechaVencimineto}')`
        );
      }
    } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error; 
    }
  }

  export async function callActualizarProducto(cod:IntegerDataType,marca: string, categoria: string, stock: IntegerDataType, precioCompra: DecimalDataType, precioVenta: DecimalDataType, fechaVencimineto: Date|null) {
    try {

      if(fechaVencimineto===undefined){
        
        const [results, metadata] = await sequelize.query(
          `CALL modificar_producto_sinFecha('${cod}','${categoria}','${marca}', '${stock}', '${precioCompra}', '${precioVenta}')`
        );
      }else{
        const [results, metadata] = await sequelize.query(
          `CALL modificar_producto('${cod}','${categoria}','${marca}','${stock}', '${precioCompra}', '${precioVenta}', '${fechaVencimineto}')`
        );
      }
    } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error; 
    }
  }


  export async function obtenerProductos(){
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM obtener_productos()`
        );
      return results;

    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error; // Puedes manejar el error como desees
    }
}