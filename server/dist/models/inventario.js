"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eliminar_inventario = exports.Mostrar_Inventario = exports.Insertar_inventario = exports.Inventario = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../db/conexion"));
exports.Inventario = conexion_1.default.define('Inventario', {
    codigo: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'inventario', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
function Insertar_inventario(nombre_producto, cantidad, nombre_almacen) {
    return __awaiter(this, void 0, void 0, function* () {
        const fecha = new Date();
        fecha.setHours(fecha.getHours() - 4);
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL insertar_inventario('${nombre_producto}','${cantidad}', '${nombre_almacen}','${fecha.toISOString()}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
        }
    });
}
exports.Insertar_inventario = Insertar_inventario;
function Mostrar_Inventario() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM mostrar_inventario()`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
        }
    });
}
exports.Mostrar_Inventario = Mostrar_Inventario;
function Eliminar_inventario(cod) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL eliminar_inventario('${cod}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
        }
    });
}
exports.Eliminar_inventario = Eliminar_inventario;
