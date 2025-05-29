import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { Permiso } from '../interfaces/permiso';
import { UserService } from '../../services/user.service';
import { PermisosService } from '../../services/permisos.service';
import { ToastrService } from 'ngx-toastr';
import { BitacoraService } from '../../services/bitacora.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-permisos.component.html',
  styleUrl: './user-permisos.component.css'
})
export class UserPermisosComponent implements OnInit{
  
  listUser: (User & Permiso)[] = [];
  vistas: string[] = ["vender", "producto", "proveedor", "notasalida", "bitacora", "usuario", "almacen", "inventario","comprar"];
  selectedVista: string = "vender";
  username: string = "";

  insertar: boolean = false;
  editar: boolean = false;
  eliminar: boolean = false;

  constructor(
    private _userServices: UserService,
    private _permisoServices: PermisosService,
    private toastr: ToastrService,
    private _bitacoraServices: BitacoraService
  ){

  }
  
  ngOnInit(): void {
    this.getUsernameFromToken();
    this.getlistUsers();
  }

  getlistUsers() {
    this._userServices.getUsers().subscribe((users: User[]) => {
      this.listUser = users.map(user => ({ ...user, perm_ver: false, perm_insertar: false, perm_editar: false, perm_eliminar: false,perm_habilitado: false }));
      this.getPermisos();
    });
  }

  getPermisos() {
    this.listUser.forEach(user => {
      this._permisoServices.getPermiso(user.username, this.selectedVista).subscribe((permisos: Permiso[]) => {
        permisos.forEach(permiso => {
          user.perm_ver = permiso.perm_ver;
          user.perm_insertar = permiso.perm_insertar;
          user.perm_editar = permiso.perm_editar;
          user.perm_eliminar = permiso.perm_eliminar;
        });
      });
    });
  }

  updatePermisos(user: User & Permiso) {
    const updatedPermiso: Permiso = {
      username: user.username,
      perm_habilitado: user.perm_habilitado,
      perm_insertar: user.perm_insertar,
      perm_editar: user.perm_editar,
      perm_eliminar: user.perm_eliminar,
      perm_ver:user.perm_ver,
      vista: this.selectedVista
    };

    this._permisoServices.updatePermiso(updatedPermiso).subscribe(() => {
      this.toastr.success(`Permisos actualizados para: ${user.username} en la vista: ${this.selectedVista}`, "Permisos Actualizados");
      this._bitacoraServices.ActualizarBitacora(`Actualizó permisos del usuario: ${user.username} en la vista: ${this.selectedVista}`);
    });
  }

  getUsernameFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        this.username = payload.username;
      } else {
        this.toastr.error('El token no tiene el formato esperado.', 'Error');
      }
    } else {
      this.toastr.error('No se encontró un token en el localStorage.', 'Error');
    }
  }

}
