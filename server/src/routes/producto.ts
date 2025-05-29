import { Router } from 'express';
import { deleteProduct, getProducto, newProducto, updateProducto } from '../controllers/producto';
import validar_token from './validar_token';
//rutas
const router = Router();


router.get('/getProduct', getProducto);
router.post('/newProduct',newProducto);
router.post('/updateProduct',updateProducto);
router.delete('/:cod',deleteProduct);


export default router;