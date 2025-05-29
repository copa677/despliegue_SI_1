"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const almacen_1 = require("../controllers/almacen");
const router = (0, express_1.Router)();
//rutas
router.get('/', almacen_1.getAlamcenes);
router.get('/:id', almacen_1.getAlmacen);
router.delete('/:id', almacen_1.deleteAlamcen);
router.post('/', almacen_1.newAlmacen);
router.put('/:id', almacen_1.updateAlamcen);
exports.default = router;
