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
exports.obtener_categoria_permiso = exports.editar_permiso = exports.insertar_permiso = exports.User = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../db/conexion"));
exports.User = conexion_1.default.define('Permisos', {
    cod: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'permisos', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
// Llamar al procedimiento almacenado
function insertar_permiso(username, perm_habilitado, perm_ver, perm_insertar, per_editar, perm_eliminar, vista) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL insertar_permisos('${username}','${perm_habilitado}','${perm_ver}','${perm_insertar}','${per_editar}',
                                    '${perm_eliminar}','${vista}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error; // Propaga el error para manejarlo en otro lugar si es necesario
        }
    });
}
exports.insertar_permiso = insertar_permiso;
function editar_permiso(username, perm_habilitado, perm_ver, perm_insertar, per_editar, perm_eliminar, vista) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL actualizar_permiso('${username}','${perm_habilitado}','${perm_ver}','${perm_insertar}','${per_editar}',
                                    '${perm_eliminar}','${vista}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error; // Propaga el error para manejarlo en otro lugar si es necesario
        }
    });
}
exports.editar_permiso = editar_permiso;
function obtener_categoria_permiso(username, vista) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM obtener_categoria_permiso('${username}','${vista}')`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error; // Propaga el error para manejarlo en otro lugar si es necesario
        }
    });
}
exports.obtener_categoria_permiso = obtener_categoria_permiso;
