"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const boleta_compra_1 = require("../controllers/boleta_compra");
const router = (0, express_1.Router)();
//rutas
router.post('/newBoletaCompra', boleta_compra_1.newBoletaCompra);
router.get('/MostrarBoletasCompra', boleta_compra_1.mostrar_boletas_compra);
router.get('/getBoletaCompra/:cod', boleta_compra_1.getBoleta_Compra);
router.delete('/deleteBoletaCompra/:cod', boleta_compra_1.deleteBoletaCompra);
router.post('/newDetallesBoletaCompra', boleta_compra_1.newDetalleBoletaCompra);
router.get('/getDetallesBoletaCompra/:cod', boleta_compra_1.getDetalles_Boleta_Compra);
exports.default = router;
