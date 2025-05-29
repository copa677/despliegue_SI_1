import { Component, OnInit } from '@angular/core';
import { Inventario } from '../interfaces/inventario';
import { InventarioService } from '../../services/inventario.service';
import { ToastrService } from 'ngx-toastr';
import { PermisosService } from '../../services/permisos.service';
import { Permiso } from '../interfaces/permiso';
import { BitacoraService } from '../../services/bitacora.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit{
  listInventario: Inventario[]=[]

  username: string = "";
  insertar: boolean = false;
  eliminar: boolean = false;

  constructor(
    private _inventarioServices: InventarioService,
    private toastr :ToastrService,
    private _permisoServices: PermisosService,
    private _bitacoraServices: BitacoraService,
  ){

  }

  ngOnInit(): void {
    this.getListInventario();
    this.getUsernameFromToken();
    this.getPermisos();
  }
  

  getPermisos(){
    this._permisoServices.getPermiso(this.username,"inventario").subscribe((data: Permiso[])=>{
      data.forEach((perm: Permiso)=>{
        this.insertar = perm.perm_insertar;
        this.eliminar = perm.perm_eliminar;
      })
    })
  }

  getUsernameFromToken() {
    const token = localStorage.getItem('token'); // Obtén el token JWT almacenado en el localStorage
    if (token) {
      const tokenParts = token.split('.'); 
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1])); // Decodifica la parte del payload
        this.username = payload.username; 
       
      } else {
        this.toastr.error('El token no tiene el formato esperado.','Error');
      }
    } else {
      this.toastr.error('No se encontró un token en el localStorage.','Error');
    }
  }

  getListInventario(){
    this._inventarioServices.getInventarios().subscribe((data:Inventario[])=>{
      this.listInventario=data;
    })
  }

  deleteInventario(cod:number,producto: String){
    this._inventarioServices.deleteInventarios(cod).subscribe(()=>{
      this.toastr.warning("Inventario Eliminado con Exito","Inventario Eliminado");
      this._bitacoraServices.ActualizarBitacora(`Elimino el inventario del producto ${producto}`)
      this.getListInventario();
    })
  }

}
