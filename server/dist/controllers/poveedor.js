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
exports.updateProveedor = exports.newProveedor = exports.deleteProveedor = exports.getProveedor = exports.getProveedores = void 0;
const proveedor_1 = require("../models/proveedor");
const getProveedores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listproveedor = yield proveedor_1.Proveedor.findAll();
    res.json(listproveedor);
});
exports.getProveedores = getProveedores;
const getProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo } = req.params;
    const proveedor = yield proveedor_1.Proveedor.findByPk(codigo);
    if (proveedor) {
        res.json(proveedor);
    }
    else {
        res.status(404).json({
            msg: `No existe un proveedor con el id ${codigo}`
        });
    }
});
exports.getProveedor = getProveedor;
const deleteProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo } = req.params;
    console.log(codigo);
    const proveedor = yield proveedor_1.Proveedor.findByPk(codigo);
    try {
        if (!proveedor) {
            res.status(404).json({
                msg: `No existe un proveedor con el id ${codigo}`
            });
        }
        else {
            yield proveedor.destroy();
            res.json({
                msg: 'El proveedor fue eliminado con exito!'
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
exports.deleteProveedor = deleteProveedor;
const newProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        yield proveedor_1.Proveedor.create(body);
        res.json({
            msg: `El proveedor fue agregado con exito!`
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error,
            error
        });
    }
});
exports.newProveedor = newProveedor;
const updateProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { codigo } = req.params;
    try {
        const proveedor = yield proveedor_1.Proveedor.findByPk(codigo);
        if (proveedor) {
            yield proveedor.update(body);
            res.json({
                msg: 'El proveedor fue actualziado con exito'
            });
        }
        else {
            res.status(404).json({
                msg: `No existe un proveedor con el id ${codigo}`
            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        });
    }
});
exports.updateProveedor = updateProveedor;
