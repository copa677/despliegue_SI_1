import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { AlmacenesComponent } from './almacenes/almacenes.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { ProductoComponent } from './producto/producto.component';
import { SignInComponent } from './new-User/sign-in.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { AddNewProveedorComponent } from './add-new-proveedor/add-new-proveedor.component';
import { AddNewAlmacenComponent } from './add-new-almacen/add-new-almacen.component';
import { BitacoraComponent } from './bitacora/bitacora.component';
import { InventarioComponent } from './inventario/inventario.component';
import { NewInventarioComponent } from './new-inventario/new-inventario.component';
import { UserPermisosComponent } from './user-permisos/user-permisos.component';
import { ComprarComponent } from './comprar/comprar.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { NewCompraComponent } from './new-compra/new-compra.component';
import { BoletaCompraComponent } from './boleta-compra/boleta-compra.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login',pathMatch:'full'},
  { path: 'login',component: LoginComponent},
  { path: 'home', component: LayoutComponent, children: [
    //{ path: '', redirectTo: '', pathMatch: 'full' }, // Redirige a la página de almacenes por defecto
    { path: 'almacen', component: AlmacenesComponent },// Ruta para el componente de almacenes 
    { path: 'proveedores', component: ProveedorComponent },
    { path: 'productos', component : ProductoComponent },  
    { path: 'registro', component : SignInComponent },
    { path: 'newPassword', component : NewPasswordComponent},
    { path: 'add', component : AddNewProveedorComponent},
    { path: 'edit/:codigo', component : AddNewProveedorComponent},
    { path: 'addAlma', component : AddNewAlmacenComponent},
    { path: 'editAlma/:id', component : AddNewAlmacenComponent},
    { path: 'bitacora', component : BitacoraComponent},
    { path: 'inventario', component : InventarioComponent},
    { path: 'newInventario', component : NewInventarioComponent},
    { path: 'userpermisos/:nom', component : UserPermisosComponent},
    { path: 'usuario', component : UsuarioComponent},
    { path: 'comprar', component : ComprarComponent},
    { path: 'Newcompra', component : NewCompraComponent},
    { path: 'BoletaCompra/:cod', component : BoletaCompraComponent},
  ]},
  { path: '**',redirectTo: 'login',pathMatch:'full'},
];
