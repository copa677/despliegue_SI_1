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
exports.updateAlamcen = exports.newAlmacen = exports.deleteAlamcen = exports.getAlmacen = exports.getAlamcenes = void 0;
const almacen_1 = require("../models/almacen");
//controller
const getAlamcenes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listalamcen = yield almacen_1.Almacen.findAll();
    res.json(listalamcen);
});
exports.getAlamcenes = getAlamcenes;
const getAlmacen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const alamcen = yield almacen_1.Almacen.findByPk(id);
    if (alamcen) {
        res.json(alamcen);
    }
    else {
        res.status(404).json({
            msg: `No existe un almacen con el id ${id}`
        });
    }
});
exports.getAlmacen = getAlmacen;
const deleteAlamcen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    const alamcen = yield almacen_1.Almacen.findByPk(id);
    try {
        if (!alamcen) {
            res.status(404).json({
                msg: `No existe un proveedor con el id ${id}`
            });
        }
        else {
            yield alamcen.destroy();
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
exports.deleteAlamcen = deleteAlamcen;
const newAlmacen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        yield almacen_1.Almacen.create(body);
        res.json({
            msg: `El Alamacen fue agregado con exito!`
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error,
            error
        });
    }
});
exports.newAlmacen = newAlmacen;
const updateAlamcen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    try {
        const alamcen = yield almacen_1.Almacen.findByPk(id);
        if (alamcen) {
            yield alamcen.update(body);
            res.json({
                msg: 'El alamcen fue actualziado con exito'
            });
        }
        else {
            res.status(404).json({
                msg: `No existe un almacen con el id ${id}`
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
exports.updateAlamcen = updateAlamcen;
