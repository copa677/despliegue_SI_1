import { DataType, DataTypes } from 'sequelize';
import sequelize from '../db/conexion';

export const Proveedor = sequelize.define('Proveedor', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    nombre: {
        type : DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'proveedores', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});