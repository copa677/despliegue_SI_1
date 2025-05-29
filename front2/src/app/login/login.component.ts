import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { User } from '../interfaces/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';
import { PermisosService } from '../../services/permisos.service';
import { Permiso } from '../interfaces/permiso';
import { BitacoraService } from '../../services/bitacora.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [CommonModule, FormsModule,SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nombreAdministrador: string = '';
  telefono: string = '';
  correoElectronico: string = '';
  username: string = '';
  password: string = '';
  loading: boolean = false;
  habilitado: boolean = false;

  constructor(
    private toastr: ToastrService,
    private _userService: UserService,
    private _permisoServices: PermisosService,
    private router: Router,
    private _errorServices: ErrorService,
    private _bitacoraServices: BitacoraService
  ) { }

  ngOnInit(): void { }

  // Método para verificar permisos de habilitación
  verificarHabilitacion(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._permisoServices.getPermiso(this.username, "vender").subscribe({
        next: (data: Permiso[]) => {
          this.habilitado = data.some((perm: Permiso) => perm.perm_habilitado);
          resolve(this.habilitado);
        },
        error: (err: HttpErrorResponse) => {
          this._errorServices.msjError(err);
          resolve(false);
        }
      });
    });
  }

  // Método de login modificado
  async login() {

    // Validamos que el usuario ingrese datos
    if (this.username == '' || this.password == '') {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }

    // Creamos el body
    const user: User = {
      nombreAdministrador: this.nombreAdministrador,
      telefono: this.telefono,
      correoelectronico: this.correoElectronico,
      username: this.username,
      password: this.password,
    };

    this.loading = true;

    // Procedemos con el login
    this._userService.login(user).subscribe({
      next: async (token) => {
        // Guardamos el token temporalmente para usarlo en la verificación de permisos
        localStorage.setItem('token', token);

        // Verificamos si el usuario está habilitado
        const habilitado = await this.verificarHabilitacion();

        if (habilitado) {
          this._bitacoraServices.ActualizarBitacora("Inicio de Sesion");
          this.router.navigate(['/home']);
        } else {
          this.toastr.error("Usuario No habilitado", "Error");
          localStorage.removeItem('token');
          this.loading = false;
        }
      },
      error: (e: HttpErrorResponse) => {
        this._errorServices.msjError(e);
        this.loading = false;
      }
    });
  }
}
