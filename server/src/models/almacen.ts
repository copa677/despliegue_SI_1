import { DataType, DataTypes } from 'sequelize';
import sequelize from '../db/conexion';

export const Almacen = sequelize.define('Almacen', {
    id: {
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
    ciudad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacidad_actual: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacidad_total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'almacen', 
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});