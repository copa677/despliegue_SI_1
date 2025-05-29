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
exports.getDetalles_Boleta_Compra = exports.newDetalleBoletaCompra = exports.deleteBoletaCompra = exports.getBoleta_Compra = exports.mostrar_boletas_compra = exports.newBoletaCompra = void 0;
const boleta_compra_1 = require("../models/boleta_compra");
const date_fns_tz_1 = require("date-fns-tz");
//controladores
const newBoletaCompra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boliviaTimeZone = 'America/La_Paz';
    const now = new Date();
    // Convertir la fecha actual a la zona horaria de Bolivia
    const zonedDate = (0, date_fns_tz_1.toZonedTime)(now, boliviaTimeZone);
    // Formatear la fecha en el formato deseado
    const formattedDate = (0, date_fns_tz_1.format)(zonedDate, 'yyyy-MM-dd', { timeZone: boliviaTimeZone });
    const { nombre_proveedor, nombre_administrador, metodo_pago_nombre, descripcion } = req.body;
    try {
        const codBoleta = yield (0, boleta_compra_1.insertar_Boleta_Compra)(nombre_proveedor, nombre_administrador, metodo_pago_nombre, descripcion, formattedDate);
        res.json(codBoleta);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error,
            error
        });
    }
});
exports.newBoletaCompra = newBoletaCompra;
const mostrar_boletas_compra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listBoletas = yield (0, boleta_compra_1.Mostrar_Boletas_Compra)();
        res.json(listBoletas);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.mostrar_boletas_compra = mostrar_boletas_compra;
const getBoleta_Compra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const codigo_boleta = parseInt(cod, 10);
    try {
        const listBoleta = yield (0, boleta_compra_1.get_Boleta_Compra)(codigo_boleta);
        res.json(listBoleta);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.getBoleta_Compra = getBoleta_Compra;
const deleteBoletaCompra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    console.log(req.params);
    const codigo_Boleta = parseInt(cod, 10);
    try {
        yield (0, boleta_compra_1.eliminar_Boleta_Compra)(codigo_Boleta);
        res.json({
            msg: `Boleta de Compra y Detalle de Boleta de compra eliminados`,
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.deleteBoletaCompra = deleteBoletaCompra;
const newDetalleBoletaCompra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { NroBoleta, nombre_producto, cantidad, precio_unitario } = req.body;
    try {
        yield (0, boleta_compra_1.insertar_Detalle_Boleta_Compra)(NroBoleta, nombre_producto, cantidad, precio_unitario);
        res.json({
            msg: `Detalle de Boleta Añadida`,
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error,
            error
        });
    }
});
exports.newDetalleBoletaCompra = newDetalleBoletaCompra;
const getDetalles_Boleta_Compra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const codigo_boleta = parseInt(cod, 10);
    try {
        const listBoleta = yield (0, boleta_compra_1.get_Detalles_Boleta_Compra)(codigo_boleta);
        res.json(listBoleta);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.getDetalles_Boleta_Compra = getDetalles_Boleta_Compra;
