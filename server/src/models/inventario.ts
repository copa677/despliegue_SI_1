import { DataType, DataTypes, DecimalDataType, INTEGER, IntegerDataType } from 'sequelize';
import sequelize from "../db/conexion";

export const Inventario = sequelize.define('Inventario', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'inventario', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});

export async function Insertar_inventario(nombre_producto: String,cantidad: number,nombre_almacen: String) {
    const fecha: Date = new Date();
    fecha.setHours(fecha.getHours()-4);
    try {
    const [results, metadata] = await sequelize.query(
        `CALL insertar_inventario('${nombre_producto}','${cantidad}', '${nombre_almacen}','${fecha.toISOString()}')`
    );

    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
    }
}

export async function Mostrar_Inventario() {
    try {
    const [results, metadata] = await sequelize.query(
        `SELECT * FROM mostrar_inventario()`
    );
    return results
    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
    }
}

export async function Eliminar_inventario(cod:number) {
    try {
    const [results, metadata] = await sequelize.query(
        `CALL eliminar_inventario('${cod}')`
    );

    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
    }
}
