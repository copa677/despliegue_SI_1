"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permisos_1 = require("../controllers/permisos");
const router = (0, express_1.Router)();
router.post('/newpermisos', permisos_1.newPermiso);
router.post('/updatepermiso', permisos_1.actualizar_Permiso);
router.post('/getpermisos', permisos_1.UserPer);
exports.default = router;
