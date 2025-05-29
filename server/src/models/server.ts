import  express, {Application}  from "express";
import cors from 'cors'
import routerUser from '../routes/user';
import routerproveedor from '../routes/proveedor';
import routerpermisos from '../routes/permisos';
import { User } from "./User";
import routerbitacora from '../routes/bitacora';
import routesProducto from '../routes/producto';
import routerinventario from '../routes/inventario';
import routeralmacen from '../routes/almacen';
import routerboletacompra from '../routes/boleta_compra';

class Server{
    private app: Application;
    private port: String;
    //constuctor
    constructor(){
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }

    listen(){
        this.app.listen(this.port,() => {
            console.log('Aplicacion corriendo en el puerto ' + this.port);
        })
    }

    routes(){
        this.app.use('/api/users',routerUser);
        this.app.use('/api/proveedor',routerproveedor);
        this.app.use('/api/permisos',routerpermisos);
        this.app.use('/api/producto', routesProducto);
        this.app.use('/api/bitacora',routerbitacora);
        this.app.use('/api/almacen',routeralmacen);
        this.app.use('/api/inventario',routerinventario);
        this.app.use('/api/boletacompra',routerboletacompra);
    }

    midlewares(){
        this.app.use(express.json());
        //cors
        this.app.use(cors())
    }

    async dbConnect(){
        try {
            await User.sync();
            console.log('Base conectada con existo');
        } catch (error) {
            console.log('Error en la base de datos: ',error);
        }
    }

}

export default Server;