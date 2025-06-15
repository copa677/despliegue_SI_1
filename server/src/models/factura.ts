import { DataType, DataTypes, DecimalDataType, INTEGER, IntegerDataType } from 'sequelize';
import sequelize from "../db/conexion";

export const Factura = sequelize.define('Factura', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'factura', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
//Llamada de los procedimientos almacenador
export async function insertar_factura(ci_cliente: number,nombre_cliente: string, correo_cliente: string, telefono_cliente: string,
                                      nombre_usuario: string, metodo_pago_nombre: string,monto_descuento:number) {
    try {
      const [results, metadata] = await sequelize.query(
        `SELECT * FROM insertar_factura('${ci_cliente}','${nombre_cliente}', '${correo_cliente}','${telefono_cliente}','${nombre_usuario}', 
                               '${metodo_pago_nombre}','${monto_descuento}')`
      );
      return results
    } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
    }
}

export async function insertar_detalle_factura(codigo_factura: number,categoria_producto_nombre: string, cantidad_producto: number) {
      try {
        const [results, metadata] = await sequelize.query(
        `CALL insertar_detalles_factura('${codigo_factura}','${categoria_producto_nombre}', '${cantidad_producto}')`
      );

    } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error;
    }
}

export async function Mostrar_Factura() {
  try {
    const [results, metadata] = await sequelize.query(
        `SELECT * FROM mostrar_facturas()`
    );
  return results;

  } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error; 
  }
}

export async function getFactura(codigo_factura : number) {
  try {
    const [results, metadata] = await sequelize.query(
        `SELECT * FROM getfactura('${codigo_factura}')`
    );
  return results;

  } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error; 
  }
}

export async function getDetalleFactura(codigo_factura : number) {
  try {
    const [results, metadata] = await sequelize.query(
        `SELECT * FROM mostrar_detalles_factura('${codigo_factura}')`
    );
  return results;

  } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error; 
  }
}

export async function EliminarFactura(codigo_factura : number) {
  try {
    const [results, metadata] = await sequelize.query(
      `CALL eliminar_factura('${codigo_factura}')`
    );

  } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error; 
  }
}

export async function Mostrar_Clientes() {
  try {
    const [results, metadata] = await sequelize.query(
        `SELECT * FROM mostrar_clientes_vinculados()`
    );
  return results;

  } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
      throw error; 
  }
}