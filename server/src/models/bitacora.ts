import { DataType, DataTypes } from 'sequelize';
import sequelize from '../db/conexion';

export const Bitacora = sequelize.define('Bitacora', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'bitacora', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});


export async function callNuevaBitacora(username: string, IP: string, FechaHora: string, descripcion: string) {
    try {
      const [results, metadata] = await sequelize.query(
        `CALL insertar_bitacora('${username}', '${IP}', '${FechaHora}', '${descripcion}')`
      );
    } catch (error) {
      console.error('Error al llamar al procedimiento almacenado:', error);
    }
}

export async function obtenerBitacoras(){
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM mostrar_bitacoras()`
        ); 
      return results;

    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error; // Puedes manejar el error como desees
    }
}