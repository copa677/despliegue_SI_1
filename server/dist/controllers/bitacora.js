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
exports.getBitacora = exports.newBitacora = void 0;
const bitacora_1 = require("../models/bitacora");
//me crea una bitacora
const newBitacora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_usuario, ip, fechahora, descripcion } = req.body;
    try {
        yield (0, bitacora_1.callNuevaBitacora)(nombre_usuario, ip, fechahora, descripcion);
        res.json({
            msg: `Bitacora Añadida`,
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error',
            error
        });
    }
});
exports.newBitacora = newBitacora;
const getBitacora = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listBitacora = yield (0, bitacora_1.obtenerBitacoras)();
        res.json(listBitacora);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error',
            error
        });
    }
});
exports.getBitacora = getBitacora;
