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
exports.getProducto = exports.deleteProduct = exports.updateProducto = exports.newProducto = void 0;
const producto_1 = require("../models/producto");
//inserta un nuevo producto
const newProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { marca, categoria, stock, precio_compra, precio_venta, fecha_vencimiento } = req.body;
    try {
        yield (0, producto_1.callCrearProducto)(marca, categoria, stock, precio_compra, precio_venta, fecha_vencimiento);
        res.json({
            msg: `Producto Añadido`,
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error,
            error
        });
    }
});
exports.newProducto = newProducto;
const updateProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod, marca, categoria, stock, precio_compra, precio_venta, fecha_vencimiento } = req.body;
    try {
        const product = yield producto_1.Producto.findByPk(cod);
        if (product) {
            yield (0, producto_1.callActualizarProducto)(cod, marca, categoria, stock, precio_compra, precio_venta, fecha_vencimiento);
            res.json({
                msg: `Producto Actualizado`,
            });
        }
        else {
            res.status(404).json({
                msg: `No Existe un producto con el codigo ${cod}`,
            });
        }
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error,
            error
        });
    }
});
exports.updateProducto = updateProducto;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const product = yield producto_1.Producto.findByPk(cod);
    try {
        if (!product) {
            res.status(404).json({
                msg: `No Existe un producto con el codigo ${cod}`,
            });
        }
        else {
            yield product.destroy();
            res.json({
                msg: 'El producto fue eliminado con exito!'
            });
        }
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error,
            error
        });
    }
});
exports.deleteProduct = deleteProduct;
const getProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listProduct = yield (0, producto_1.obtenerProductos)();
        //console.log(_listProduct);
        res.json(listProduct);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error,
            error
        });
    }
});
exports.getProducto = getProducto;
