import { Component, OnInit } from '@angular/core';
import { Toast, ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';
import { PermisosService } from '../../services/permisos.service';
import { Permiso } from '../interfaces/permiso';
import { BitacoraService } from '../../services/bitacora.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  nombre: string = '';
  telefono: string = '';
  email: string = '';
  permisos: string = '';

  username: string = '';
  password: string = '';
  confirm_password = '';

  habilitado: boolean = false;
  ver: boolean = false;
  insertar: boolean = false;
  editar: boolean = false;
  eliminar: boolean = false;
  listvistas: string[]=["vender","producto","proveedor","notasalida","bitacora","usuario","almacen","inventario","comprar"];

  constructor(private toastr: ToastrService,
    private _userServices: UserService,
    private _permisoServices: PermisosService,
    private router: Router,
    private _errorServices: ErrorService,
    private _bitacoraServices:BitacoraService
  ){}

  ngOnInit(): void {
    
  }

  InsertarPermisos(){
    
    switch (this.permisos){
      case "A":
        this.habilitado = true;
        this.ver = true;
        this.insertar = true;
        this.editar = true;
        this.eliminar = true;
        break;
      case "B":
        this.habilitado = true;
        this.ver = true;
        this.insertar = true;
        this.editar = false;
        this.eliminar = false;
        break;
      case "C": 
        this.habilitado = true;
        this.ver = true;
        this.insertar = false;
        this.editar = false;
        this.eliminar = false;
        break;
    }

    

    this.listvistas.forEach((vista: string)=>{
      const permiso: Permiso = {
        username: this.username,
        perm_habilitado: this.habilitado,
        perm_insertar: this.insertar,
        perm_editar: this.editar,
        perm_eliminar: this.eliminar,
        perm_ver:this.ver,
        vista: vista
      }
      this._permisoServices.newPermiso(permiso).subscribe(()=>{
      })
    })
  }

  addUser(){
    //validar campos}
    if(this.nombre == '' || this.telefono == '' || this.email == '' || this.permisos == '' || this.username == ''||
      this.password == '' || this.confirm_password == ''){
        this.toastr.error('Todos los campos son obligatorios','Error');
        return;
      } 

      //validamos si las password son correctas 
    if(this.password != this.confirm_password){
      this.toastr.error('Las password ingresadas son distintas','Error');
        return;
    }

    const user: User = {
      nombreAdministrador: this.nombre,
      telefono: this.telefono,
      correoelectronico: this.email,
      username: this.username,
      password: this.password,
    }

    this._userServices.newUser(user).subscribe(
      (data: any) => {
        // Manejar la respuesta exitosa aquí
        
        this.InsertarPermisos();

        this.toastr.success('Usuario Creado con exito','Usuario Creado')
        this.limpiarCampos();
      },
      (error: HttpErrorResponse) => {
        // Manejar el error aquí
        this._errorServices.msjError(error);
      } 
    );
    this._bitacoraServices.ActualizarBitacora(`Creó el Nuevo Usuario: ${user.username}`);
  }

  limpiarCampos() {
    this.nombre = '';
    this.telefono = '';
    this.email = '';
    this.username = '';
    this.password = '';
    this.confirm_password = '';
    this.permisos = '';
  }
}
