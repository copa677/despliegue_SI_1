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
exports.obtenerBitacoras = exports.callNuevaBitacora = exports.Bitacora = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../db/conexion"));
exports.Bitacora = conexion_1.default.define('Bitacora', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'bitacora', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
function callNuevaBitacora(username, IP, FechaHora, descripcion) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL insertar_bitacora('${username}', '${IP}', '${FechaHora}', '${descripcion}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
        }
    });
}
exports.callNuevaBitacora = callNuevaBitacora;
function obtenerBitacoras() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM mostrar_bitacoras()`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error; // Puedes manejar el error como desees
        }
    });
}
exports.obtenerBitacoras = obtenerBitacoras;
