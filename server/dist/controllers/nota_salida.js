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
exports.deletNotasVacias = exports.getDetalleSalida = exports.deleteDetalleSalida = exports.updateDetalleSalida = exports.newDetalleSalida = exports.updateNota_Salida = exports.deleteNota_Salida = exports.getNota_Salida = exports.getNotas_de_Salida = exports.newNotaSalida = void 0;
const nota_salida_1 = require("../models/nota_salida");
const date_fns_tz_1 = require("date-fns-tz");
const newNotaSalida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const boliviaTimeZone = 'America/La_Paz';
    const now = new Date();
    // Convertir la fecha actual a la zona horaria de Bolivia
    const zonedDate = (0, date_fns_tz_1.toZonedTime)(now, boliviaTimeZone);
    // Formatear la fecha en el formato deseado
    const formattedDate = (0, date_fns_tz_1.format)(zonedDate, 'yyyy-MM-dd', { timeZone: boliviaTimeZone });
    // Reemplazar la fecha en el cuerpo de la solicitud con la fecha ajustada
    body.fecha = formattedDate;
    try {
        const notaSalida = yield nota_salida_1.NotaSalida.create(body);
        const cod = notaSalida.getDataValue('cod');
        res.json(cod);
    }
    catch (error) {
        console.log(error);
        res.json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.newNotaSalida = newNotaSalida;
// Sigue asegurándote de que los otros métodos manejen las fechas correctamente si es necesario.
// Incluye tus otros métodos aquí de manera similar, y asegúrate de que manejan fechas correctamente si es necesario
const getNotas_de_Salida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listNsalida = yield nota_salida_1.NotaSalida.findAll();
    res.json(listNsalida);
});
exports.getNotas_de_Salida = getNotas_de_Salida;
const getNota_Salida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const NSalida = yield nota_salida_1.NotaSalida.findByPk(cod);
    if (NSalida) {
        res.json(NSalida);
    }
    else {
        res.status(404).json({
            msg: `No existe un almacen con el id ${cod}`
        });
    }
});
exports.getNota_Salida = getNota_Salida;
const deleteNota_Salida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const codigo_NotaS = parseInt(cod, 10);
    try {
        yield (0, nota_salida_1.Eliminar_nota_salida)(codigo_NotaS);
        res.json({
            msg: "Nota de Salida eliminada con exito"
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.deleteNota_Salida = deleteNota_Salida;
const updateNota_Salida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const NSalida = parseInt(cod, 10);
    const { origen, descripcion, fecha } = req.body;
    try {
        yield (0, nota_salida_1.Actulizar_nota_salida)(NSalida, fecha, origen, descripcion);
        res.json({
            msg: "Nota de salida actualizado con exito"
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.updateNota_Salida = updateNota_Salida;
const newDetalleSalida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod_salida, nombre_producto, cantidad } = req.body;
    console.log(cod_salida);
    try {
        yield (0, nota_salida_1.Insertar_detalle_salida)(cod_salida, nombre_producto, cantidad);
        res.json({
            msg: "Detalle de salida creado con exito"
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.newDetalleSalida = newDetalleSalida;
const updateDetalleSalida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod_detalle, nombre_producto, cantidad } = req.body;
    try {
        yield (0, nota_salida_1.Actulizar_detalle_salida)(cod_detalle, nombre_producto, cantidad);
        res.json({
            msg: "Detalle de salida actualizado con exito"
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.updateDetalleSalida = updateDetalleSalida;
const deleteDetalleSalida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const codigo_Detalle = parseInt(cod, 10);
    try {
        yield (0, nota_salida_1.Eliminar_detalle_salida)(codigo_Detalle);
        res.json({
            msg: "Detalle de Nota de Salida eliminada con exito"
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.deleteDetalleSalida = deleteDetalleSalida;
const getDetalleSalida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cod } = req.params;
    const codigo_Salida = parseInt(cod, 10);
    try {
        const listDetSalida = yield (0, nota_salida_1.Mostrar_detalle_nota_salida)(codigo_Salida);
        res.json(listDetSalida);
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.getDetalleSalida = getDetalleSalida;
const deletNotasVacias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, nota_salida_1.Eliminar_notas_vacias)();
        res.json({
            msg: "Notas Eliminadas"
        });
    }
    catch (error) {
        res.status(401).json({
            msg: 'Ups Ocurrio Un error ' + error.message,
            error: error.message
        });
    }
});
exports.deletNotasVacias = deletNotasVacias;
