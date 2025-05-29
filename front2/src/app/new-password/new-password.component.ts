import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import { User } from '../interfaces/user';
import { HttpErrorResponse } from '@angular/common/http';
import { BitacoraService } from '../../services/bitacora.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit {
  
  nombreAdministrador: string = '';
  telefono: string = '';
  correoElectronico: string = '';

  username: string = '';

  password: string = '';
  confirm_password: string = '';

  tipoPermiso: string = '';

  constructor(private toastr: ToastrService,
    private _userService: UserService,
    private router: Router,
    private _errorServices: ErrorService,
    private _bitacoraServices:BitacoraService,
  ){
  }
  
  
  ngOnInit(): void {
    this.getUsernameFromToken();
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

  newPassword(){
    if (this.password == '' || this.confirm_password == '') {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return
    }

    if (this.password != this.confirm_password) {
      this.toastr.error('Las contraseñas deben ser iguales', 'Error');
      return
    }

    const user: User = {
      nombreAdministrador: this.nombreAdministrador,
      telefono: this.telefono,
      correoelectronico: this.correoElectronico,
      username: this.username,
      password: this.password,
    }

    this._userService.newPassword(user).subscribe(
      (data: any) => {
        // Manejar la respuesta exitosa aquí
        this.limpiarCampos();
        this.toastr.success('Password actualizado exitosamente','Correcto')
      },
      (error: HttpErrorResponse) => {
        // Manejar el error aquí
        this._errorServices.msjError(error);
      } 
    );
    this._bitacoraServices.ActualizarBitacora("Actualizó su contraseña");
  }

  limpiarCampos() {
    this.password = '';
    this.confirm_password = '';
  }

}


