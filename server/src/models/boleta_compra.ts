import { DataType, DataTypes, DecimalDataType, INTEGER, IntegerDataType } from 'sequelize';
import sequelize from "../db/conexion";

export const Factura = sequelize.define('BoletaCompra', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'boleta_de_compra', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});

export async function insertar_Boleta_Compra(nombre_proveedor: string, username: string, pago: string, descripcion:string, fecha: string ) {
    try {
      const [results, metadata] = await sequelize.query(
      `SELECT * FROM insertar_boleta_compra('${nombre_proveedor}','${username}', '${pago}', '${descripcion}', '${fecha}')`
    );
    return results;
  } catch (error) {
    console.error('Error al llamar al procedimiento almacenado:', error);
    throw error;
  }
}

export async function Mostrar_Boletas_Compra() {
    try {
      const [results, metadata] = await sequelize.query(
          `SELECT * FROM obtener_boletas_compra()`
      );
    return results;
  
    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error; 
    }
}

export async function get_Boleta_Compra(NroBoleta: number) {
    try {
      const [results, metadata] = await sequelize.query(
          `SELECT * FROM obtener_boleta_compra('${NroBoleta}')`
      );
    return results;
  
    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error; 
    }
}

export async function eliminar_Boleta_Compra(NroBoleta: number) {
    try {
      const [results, metadata] = await sequelize.query(
      `CALL eliminar_boleta_compra('${NroBoleta}')`
    );

  } catch (error) {
    console.error('Error al llamar al procedimiento almacenado:', error);
    throw error;
  }
}

export async function insertar_Detalle_Boleta_Compra(NroBoleta: number, producto_nombre: string, cantidad: number, precio:number) {
  try {
    const [results, metadata] = await sequelize.query(
    `CALL insertar_detalle_compra('${NroBoleta}','${producto_nombre}', '${cantidad}', '${precio}')`
  );

  } catch (error) {
    console.error('Error al llamar al procedimiento almacenado:', error);
    throw error;
  }
}

export async function get_Detalles_Boleta_Compra(NroBoleta: number) {
  try {
    const [results, metadata] = await sequelize.query(
        `SELECT * FROM obtener_detalles_boleta_compra('${NroBoleta}')`
    );
  return results;

  } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error; 
  }
}