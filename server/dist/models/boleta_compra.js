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
exports.get_Detalles_Boleta_Compra = exports.insertar_Detalle_Boleta_Compra = exports.eliminar_Boleta_Compra = exports.get_Boleta_Compra = exports.Mostrar_Boletas_Compra = exports.insertar_Boleta_Compra = exports.Factura = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../db/conexion"));
exports.Factura = conexion_1.default.define('BoletaCompra', {
    codigo: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'boleta_de_compra', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
function insertar_Boleta_Compra(nombre_proveedor, username, pago, descripcion, fecha) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM insertar_boleta_compra('${nombre_proveedor}','${username}', '${pago}', '${descripcion}', '${fecha}')`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.insertar_Boleta_Compra = insertar_Boleta_Compra;
function Mostrar_Boletas_Compra() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM obtener_boletas_compra()`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.Mostrar_Boletas_Compra = Mostrar_Boletas_Compra;
function get_Boleta_Compra(NroBoleta) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM obtener_boleta_compra('${NroBoleta}')`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.get_Boleta_Compra = get_Boleta_Compra;
function eliminar_Boleta_Compra(NroBoleta) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL eliminar_boleta_compra('${NroBoleta}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.eliminar_Boleta_Compra = eliminar_Boleta_Compra;
function insertar_Detalle_Boleta_Compra(NroBoleta, producto_nombre, cantidad, precio) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL insertar_detalle_compra('${NroBoleta}','${producto_nombre}', '${cantidad}', '${precio}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.insertar_Detalle_Boleta_Compra = insertar_Detalle_Boleta_Compra;
function get_Detalles_Boleta_Compra(NroBoleta) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM obtener_detalles_boleta_compra('${NroBoleta}')`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.get_Detalles_Boleta_Compra = get_Detalles_Boleta_Compra;
