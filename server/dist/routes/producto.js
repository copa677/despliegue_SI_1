"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producto_1 = require("../controllers/producto");
//rutas
const router = (0, express_1.Router)();
router.get('/getProduct', producto_1.getProducto);
router.post('/newProduct', producto_1.newProducto);
router.post('/updateProduct', producto_1.updateProducto);
router.delete('/:cod', producto_1.deleteProduct);
exports.default = router;
