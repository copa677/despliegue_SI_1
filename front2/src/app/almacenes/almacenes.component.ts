import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AlmacenServices } from '../../services/almacen.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Almacen } from '../interfaces/almacen';
import { PermisosService } from '../../services/permisos.service';
import { Permiso } from '../interfaces/permiso';
import { BitacoraService } from '../../services/bitacora.service';
import { ErrorService } from '../../services/error.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-almacenes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.css']
})
export class AlmacenesComponent implements OnInit {
  almacenes: Almacen[] = []; // Aquí almacenaremos los almacenes
  username: string = "";
  insertar: boolean = false;
  editar: boolean = false;
  eliminar: boolean = false;


  constructor(private fb: FormBuilder,
    private _alamcenServices: AlmacenServices,
    private _permisoServices: PermisosService,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private router: Router,
    private _bitacoraServices: BitacoraService,
    private _errorServices: ErrorService,
  ) {
    
  }
  ngOnInit(): void {
    this.getListAlmacenes();
    this.getUsernameFromToken();
    this.getPermisos();
  }

  getPermisos(){
    this._permisoServices.getPermiso(this.username,"almacen").subscribe((data: Permiso[])=>{
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

  

  getListAlmacenes(){
    this._alamcenServices.getlistAlmacenes().subscribe((data)=>{
      this.almacenes=data;
    })
  }



  deleteAlamcen(id: number,nombre: string){
    this._alamcenServices.deleteAlmacen(id).subscribe(()=>{
      this.getListAlmacenes();
      this._bitacoraServices.ActualizarBitacora(`El almacen ${nombre}, fue eliminado`)
      this.toastr.warning(`El Almacen: ${nombre}, fue eliminado con Exito`,'Almacen eliminado');
    },error =>{
      this._errorServices.msjError(error);
    })
  }

  navegar(){
    this.router.navigate(['/home/addAlma']);
  }
}
