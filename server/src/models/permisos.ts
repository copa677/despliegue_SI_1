import { DataType, DataTypes } from 'sequelize';
import sequelize from '../db/conexion';

export const User = sequelize.define('Permisos', {
    cod: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'permisos', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});

// Llamar al procedimiento almacenado
export async function insertar_permiso(username:string,perm_habilitado:boolean,perm_ver:boolean,
    perm_insertar:boolean,per_editar:boolean,perm_eliminar:boolean,vista: string) {
    try {
        const [results, metadata] = await sequelize.query(
            `CALL insertar_permisos('${username}','${perm_habilitado}','${perm_ver}','${perm_insertar}','${per_editar}',
                                    '${perm_eliminar}','${vista}')`
        );
    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error; // Propaga el error para manejarlo en otro lugar si es necesario
    }
}

export async function editar_permiso(username:string,perm_habilitado:boolean,perm_ver:boolean,
    perm_insertar:boolean,per_editar:boolean,perm_eliminar:boolean,vista: string) {
    try {
        const [results, metadata] = await sequelize.query(
            `CALL actualizar_permiso('${username}','${perm_habilitado}','${perm_ver}','${perm_insertar}','${per_editar}',
                                    '${perm_eliminar}','${vista}')`
        );
    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error; // Propaga el error para manejarlo en otro lugar si es necesario
    }
}

export async function obtener_categoria_permiso(username:string,vista: string) {
    try {
        const [results, metadata] = await sequelize.query(
            `SELECT * FROM obtener_categoria_permiso('${username}','${vista}')`
        );
        return results;
    } catch (error) {
        console.error('Error al llamar al procedimiento almacenado:', error);
        throw error; // Propaga el error para manejarlo en otro lugar si es necesario
    }
  }