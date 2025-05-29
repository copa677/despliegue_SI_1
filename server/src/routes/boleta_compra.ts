import { Router } from 'express';
import { deleteBoletaCompra, getBoleta_Compra, getDetalles_Boleta_Compra, mostrar_boletas_compra, newBoletaCompra, newDetalleBoletaCompra } from '../controllers/boleta_compra';

const router = Router();
//rutas
router.post('/newBoletaCompra',newBoletaCompra);
router.get('/MostrarBoletasCompra',mostrar_boletas_compra);
router.get('/getBoletaCompra/:cod',getBoleta_Compra);
router.delete('/deleteBoletaCompra/:cod',deleteBoletaCompra);
router.post('/newDetallesBoletaCompra',newDetalleBoletaCompra);
router.get('/getDetallesBoletaCompra/:cod',getDetalles_Boleta_Compra);

export default router;