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
exports.deleteInventario = exports.getInventarios = exports.newInventario = void 0;
const inventario_1 = require("../models/inventario");
//controller
const newInventario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_producto, cantidad, nombre_almacen } = req.body;
    try {
        yield (0, inventario_1.Insertar_inventario)(nombre_producto, cantidad, nombre_almacen);
        res.json({
            msg: "inventario creado con exito"
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error' + error,
            error
        });
    }
});
exports.newInventario = newInventario;
const getInventarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listInventarios = yield (0, inventario_1.Mostrar_Inventario)();
        res.json(listInventarios);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error' + error,
            error
        });
    }
});
exports.getInventarios = getInventarios;
const deleteInventario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const codigo_inventario = parseInt(cod, 10);
    try {
        yield (0, inventario_1.Eliminar_inventario)(codigo_inventario);
        res.json({
            msg: "inventario eliminado con exito"
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error' + error,
            error
        });
    }
});
exports.deleteInventario = deleteInventario;
