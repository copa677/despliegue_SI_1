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
exports.Mostrar_Clientes = exports.EliminarFactura = exports.getDetalleFactura = exports.getFactura = exports.Mostrar_Factura = exports.insertar_detalle_factura = exports.insertar_factura = exports.Factura = void 0;
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../db/conexion"));
exports.Factura = conexion_1.default.define('Factura', {
    codigo: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'factura', // Nombre de la tabla existente en la base de datos
    timestamps: false // Indica que no hay columnas 'createdAt' y 'updatedAt' en la tabla
});
//Llamada de los procedimientos almacenador
function insertar_factura(ci_cliente, nombre_cliente, correo_cliente, telefono_cliente, nombre_usuario, metodo_pago_nombre, monto_descuento) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM insertar_factura('${ci_cliente}','${nombre_cliente}', '${correo_cliente}','${telefono_cliente}','${nombre_usuario}', 
                               '${metodo_pago_nombre}','${monto_descuento}')`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
        }
    });
}
exports.insertar_factura = insertar_factura;
function insertar_detalle_factura(codigo_factura, categoria_producto_nombre, cantidad_producto) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL insertar_detalles_factura('${codigo_factura}','${categoria_producto_nombre}', '${cantidad_producto}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.insertar_detalle_factura = insertar_detalle_factura;
function Mostrar_Factura() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM mostrar_facturas()`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.Mostrar_Factura = Mostrar_Factura;
function getFactura(codigo_factura) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM getfactura('${codigo_factura}')`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.getFactura = getFactura;
function getDetalleFactura(codigo_factura) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM mostrar_detalles_factura('${codigo_factura}')`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.getDetalleFactura = getDetalleFactura;
function EliminarFactura(codigo_factura) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`CALL eliminar_factura('${codigo_factura}')`);
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.EliminarFactura = EliminarFactura;
function Mostrar_Clientes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [results, metadata] = yield conexion_1.default.query(`SELECT * FROM mostrar_clientes_vinculados()`);
            return results;
        }
        catch (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            throw error;
        }
    });
}
exports.Mostrar_Clientes = Mostrar_Clientes;
