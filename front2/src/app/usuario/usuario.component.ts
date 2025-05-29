import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../../services/user.service';
import { PermisosService } from '../../services/permisos.service';
import { Permiso } from '../interfaces/permiso';
import { ToastrService } from 'ngx-toastr';
import { BitacoraService } from '../../services/bitacora.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit{
  userHabilitadoMap: { [key: string]: boolean } = {};
  username: string = "";

  insertar: boolean = false;
  editar: boolean = false;
  eliminar: boolean = false;
  listUser: User[] = [];

  Uver:boolean = false;
  Uinsertar: boolean = false;
  Ueditar: boolean = false;
  Ueliminar: boolean = false;
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
    this.getPermisos();
  }

  getlistUsers(){
    this._userServices.getUsers().subscribe((data: User[])=>{
      this.listUser=data;
      this.listUser.forEach(user => {
        this.Habilitado(user.username);
      });
    })
  }

  Habilitado(username:string){
    this._permisoServices.getPermiso(username,"usuario").subscribe((data: Permiso[])=>{
      data.forEach((p: Permiso)=>{
        this.userHabilitadoMap[username] = p.perm_habilitado;
      })
    })
  }

  DesabilitarUser(username: string){

    this._permisoServices.getPermiso(username,"usuario").subscribe((data: Permiso[])=>{
      data.forEach((p: Permiso)=>{
        this.Uver = p.perm_ver;
        this.Uinsertar = p.perm_eliminar;
        this.Ueditar = p.perm_editar!;
        this.Ueliminar = p.perm_eliminar;
      })
    })
    const permi: Permiso = {
      perm_habilitado: false,
      perm_insertar: this.Uinsertar,
      perm_editar: this.Ueditar,
      perm_eliminar: this.Ueliminar,
      perm_ver: this.Uver
    }
    this._permisoServices.updatePermiso(permi).subscribe(()=>{
      this.toastr.warning(`Usuario: ${username} desabilitado con exito`,"Usuario desabilitado");
      this._bitacoraServices.ActualizarBitacora(`Desabilito al usuario: ${username}`)
    })

    this._permisoServices.getPermiso(username, "usuario").subscribe((data: Permiso[]) => {
      data.forEach((p: Permiso) => {
        this.userHabilitadoMap[username] = p.perm_habilitado;
      });
    });
    
  }

  getPermisos(){
    this._permisoServices.getPermiso(this.username,"usuario").subscribe((data: Permiso[])=>{
      data.forEach((p: Permiso)=>{
        this.insertar=p.perm_insertar;
        this.editar=p.perm_editar!;
        this.eliminar=p.perm_eliminar;
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

}
