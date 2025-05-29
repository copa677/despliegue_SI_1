"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bitacora_1 = require("../controllers/bitacora");
//rutas
const router = (0, express_1.Router)();
router.post('/newBitacora', bitacora_1.newBitacora);
router.get('/getBitacora', bitacora_1.getBitacora);
exports.default = router;
