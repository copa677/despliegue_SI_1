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
exports.Eliminar_detalle_salida = exports.Actulizar_detalle_salida = exports.Mostrar_detalle_nota_salida = exports.Eliminar_nota_salida = exports.Eliminar_notas_vacias = exports.Insertar_detalle_salida = exports.Actulizar_nota_salida = exports.NotaSalida = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../db/conexion"));
exports.NotaSalida = conexion_1.default.define('NotaSalida', {
    cod: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    origen: {
        type: sequelize_1.DataTypes.STRING,
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    tableName: 'nota_salida', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
//Llamada de los procedimientos almacenador
function Actulizar_nota_salida(codSalida, fecha, origen, descripcion) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL actualizar_nota_salida('${codSalida}','${fecha}', '${origen}','${descripcion}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.Actulizar_nota_salida = Actulizar_nota_salida;
function Insertar_detalle_salida(codSalida, producto, cantidad) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL insertar_detalle_salida('${codSalida}','${producto}', '${cantidad}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.Insertar_detalle_salida = Insertar_detalle_salida;
function Eliminar_notas_vacias() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL eliminar_notas_salida_vacias()`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.Eliminar_notas_vacias = Eliminar_notas_vacias;
function Eliminar_nota_salida(codSalida) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL eliminar_nota_salida('${codSalida}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.Eliminar_nota_salida = Eliminar_nota_salida;
function Mostrar_detalle_nota_salida(codSalida) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM mostrar_detalle_nota_salida('${codSalida}')`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.Mostrar_detalle_nota_salida = Mostrar_detalle_nota_salida;
function Actulizar_detalle_salida(codSalida, producto, cantidad) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL actualizar_detalle_salida('${codSalida}','${producto}', '${cantidad}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.Actulizar_detalle_salida = Actulizar_detalle_salida;
function Eliminar_detalle_salida(codDetalle) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL eliminar_detalle_nota_salida('${codDetalle}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.Eliminar_detalle_salida = Eliminar_detalle_salida;
