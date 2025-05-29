import { Router } from 'express';
import { deleteProveedor, getProveedor, getProveedores, newProveedor, updateProveedor } from '../controllers/poveedor';


const router = Router();

router.get('/',getProveedores);
router.get('/:codigo',getProveedor);
router.delete('/:codigo',deleteProveedor);
router.post('/',newProveedor);
router.put('/:codigo',updateProveedor);



export default router;