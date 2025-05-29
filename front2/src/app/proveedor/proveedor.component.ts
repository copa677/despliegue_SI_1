import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from '../../services/proveedores.service';
import { Proveedores } from '../interfaces/proveedores';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PermisosService } from '../../services/permisos.service';
import { Permiso } from '../interfaces/permiso';
import { ErrorService } from '../../services/error.service';
import { BitacoraService } from '../../services/bitacora.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit{

  username: string = "";
  insertar: boolean = false;
  editar: boolean = false;
  eliminar: boolean =false;

  constructor(private _proveedorServices: ProveedoresService,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private _errorServices: ErrorService,
    private permisoServices: PermisosService,
    private router: Router,
    private _bitacoraServices:BitacoraService
  ){
  }

  ngOnInit(): void {
    this.getListProveeedores();
    this.getUsernameFromToken();
    this.getPermisos();
  }

  getPermisos(){
    this.permisoServices.getPermiso(this.username,"proveedor").subscribe((data: Permiso[])=>{
      data.forEach((perm: Permiso)=>{
        this.insertar = perm.perm_insertar;
        this.editar = perm.perm_editar!;
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

  getListProveeedores(){
    this._proveedorServices.getlistProveedores().subscribe((data)=>{
      this.proveedores=data;
    })
  }



  
  proveedores: Proveedores[] = [];

  deleteProveedor(codigo: number,nombre:string){
    this._proveedorServices.deleteProveedor(codigo).subscribe(()=>{
      this.getListProveeedores();
      this.toastr.warning('El Proveedor fue eliminado con Exito','Proveedor eliminado');
      this._bitacoraServices.ActualizarBitacora(`Elimino el Proveedor: ${nombre}`);
    },error =>{
      this._errorServices.msjError(error);
    })
  }

  navegar(){
    this.router.navigate(['/home/add']);
  }
}

