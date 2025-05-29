"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventario_1 = require("../controllers/inventario");
const router = (0, express_1.Router)();
//rutas
router.post('/newInventario', inventario_1.newInventario);
router.get('/getInventarios', inventario_1.getInventarios);
router.delete('/:cod', inventario_1.deleteInventario);
exports.default = router;
