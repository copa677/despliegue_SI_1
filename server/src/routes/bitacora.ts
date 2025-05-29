import { Router } from 'express';
import { getBitacora, newBitacora } from '../controllers/bitacora';
//rutas
const router = Router();

router.post('/newBitacora', newBitacora);
router.get('/getBitacora', getBitacora);


export default router;