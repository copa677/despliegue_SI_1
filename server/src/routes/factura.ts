import { Router } from 'express';
import { deleteFactura, detalle_factura, getDetallefactura, getfactura, mostrar_clientes, mostrar_facturas, newFactura } from '../controllers/factura';

const router = Router();


router.post('/newFactura',newFactura);
router.post('/DetalleFactura',detalle_factura);
router.get('/MostrarFacturas',mostrar_facturas);
router.get('/getFactura/:cod',getfactura);
router.get('/getDetalleFactura/:cod',getDetallefactura);
router.delete('/:cod',deleteFactura);

router.get('/MostrarClientes',mostrar_clientes);
export default router;