import { Router } from 'express';
import { deletNotasVacias, deleteDetalleSalida, deleteNota_Salida, getDetalleSalida, getNota_Salida, getNotas_de_Salida, newDetalleSalida, newNotaSalida, updateDetalleSalida, updateNota_Salida } from '../controllers/nota_salida';

const router = Router();

router.post('/newNotaSalida',newNotaSalida);
router.get('/getNotasSalida',getNotas_de_Salida);
router.get('/getNotaSalida/:cod',getNota_Salida);
router.put('/updateNotaSalida/:cod',updateNota_Salida);
router.delete('/deleteNotaSalida/:cod',deleteNota_Salida);

router.post('/newDetNotaSalida',newDetalleSalida);
router.get('/getDetsNotaSalida/:cod',getDetalleSalida);
router.put('/updateDeNotaSalida',updateDetalleSalida);
router.delete('/deleteDeNotaSalida/:cod',deleteDetalleSalida);

router.delete('/deleteNotasVacias',deletNotasVacias);
export default router;