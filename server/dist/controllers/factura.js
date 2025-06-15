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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mostrar_clientes = exports.deleteFactura = exports.getDetallefactura = exports.getfactura = exports.mostrar_facturas = exports.detalle_factura = exports.newFactura = void 0;
const factura_1 = require("../models/factura");
const newFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ci_cliente, nombre_cliente, correo_cliente, telefono_cliente, nombre_usuario, metodo_pago_nombre, monto_descuento } = req.body;
    console.log(req.body);
    try {
        const codFac = yield (0, factura_1.insertar_factura)(ci_cliente, nombre_cliente, correo_cliente, telefono_cliente, nombre_usuario, metodo_pago_nombre, monto_descuento);
        res.json(codFac);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error,
            error
        });
    }
});
exports.newFactura = newFactura;
const detalle_factura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo_factura, categoria_producto_nombre, cantidad_producto } = req.body;
    try {
        yield (0, factura_1.insertar_detalle_factura)(codigo_factura, categoria_producto_nombre, cantidad_producto);
        res.json({
            msg: `Detalle de Factura Añadida`,
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.detalle_factura = detalle_factura;
const mostrar_facturas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listFactura = yield (0, factura_1.Mostrar_Factura)();
        res.json(listFactura);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.mostrar_facturas = mostrar_facturas;
const getfactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const codigo_factura = parseInt(cod, 10);
    try {
        const listFactura = yield (0, factura_1.getFactura)(codigo_factura);
        res.json(listFactura);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.getfactura = getfactura;
const getDetallefactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const codigo_factura = parseInt(cod, 10);
    try {
        const listFactura = yield (0, factura_1.getDetalleFactura)(codigo_factura);
        res.json(listFactura);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.getDetallefactura = getDetallefactura;
const deleteFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const codigo_factura = parseInt(cod, 10);
    try {
        yield (0, factura_1.EliminarFactura)(codigo_factura);
        res.json({
            msg: `Factura y Detalle de Factura eliminada`,
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.deleteFactura = deleteFactura;
const mostrar_clientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listcliente = yield (0, factura_1.Mostrar_Clientes)();
        res.json(listcliente);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.mostrar_clientes = mostrar_clientes;
