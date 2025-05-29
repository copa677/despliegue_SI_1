"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Almacen = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../db/conexion"));
exports.Almacen = conexion_1.default.define('Almacen', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    ciudad: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    capacidad_actual: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    capacidad_total: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'almacen',
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
