import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { PermisosService } from '../../services/permisos.service';
import { BitacoraService } from '../../services/bitacora.service';
import { Permiso } from '../interfaces/permiso';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public AlmacenForm!: FormGroup;
  listvistas: string[] = ["vender", "producto", "proveedor", "notasalida", "bitacora", "usuario", "comprar"];
  ver_vender = false;
  ver_producto = false;
  ver_proveedor = false;
  ver_notasalida = false;
  ver_bitacora = false;
  ver_usuarios = false;
  ver_comprar = false;

  mostrarPersona = false;
  mostrarInventario = false;
  mostrarVentas = false;

  private token: string;
  username: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _userService: UserService,
    private toastr: ToastrService,
    private _permisoServices: PermisosService,
    private _bitacoraServices: BitacoraService
  ) {
    this.token = localStorage.getItem('token') || '';
    if (this.token === '') {
      this.toastr.error('Acceso denegado', 'Error');
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnInit(): void {
    this.AlmacenForm = this.fb.group({});
    this.getUsernameFromToken();
    this.getPerVista();
  }

  getPerVista() {
    this.listvistas.forEach((vista: string) => {
      this._permisoServices.getPermiso(this.username, vista).subscribe((data: Permiso[]) => {
        data.forEach((permiso: Permiso) => {
          switch (vista) {
            case 'vender': this.ver_vender = permiso.perm_ver; break;
            case 'producto': this.ver_producto = permiso.perm_ver; break;
            case 'proveedor': this.ver_proveedor = permiso.perm_ver; break;
            case 'notasalida': this.ver_notasalida = permiso.perm_ver; break;
            case 'bitacora': this.ver_bitacora = permiso.perm_ver; break;
            case 'usuario': this.ver_usuarios = permiso.perm_ver; break;
            case 'comprar': this.ver_comprar = permiso.perm_ver; break;
            default: this.toastr.error(`Vista desconocida: ${permiso.vista}`); break;
          }
        });
      });
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

  // Navegación
  onAlmacen() { this.router.navigate(['/Almacen']); }
  almacen() { this.router.navigate(['/home/almacen']); }
  proveedores() { this.router.navigate(['/home/proveedores']); }
  producto() { this.router.navigate(['/home/productos']); }
  vender() { this.router.navigate(['/home/vender']); }
  home() { this.router.navigate(['/home']); }
  registro() { this.router.navigate(['/home/usuario']); }
  cambiar_password() { this.router.navigate(['/home/newPassword']); }
  logOut() {
    this._bitacoraServices.ActualizarBitacora("Cerro Sesion");
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  bitacora() { this.router.navigate(['/home/bitacora']); }
  NotaSalida() { this.router.navigate(['/home/notasalida']); }
  comprar() { this.router.navigate(['/home/comprar']); }
  ReporteCompra() { this.router.navigate(['/home/reportecompra']); }
  ReporteVenta() { this.router.navigate(['/home/reporteventa']); }
  ReporteActividad() { this.router.navigate(['/home/reporteactividad']); }
  Analisis() { this.router.navigate(['/home/analisis']); }
}
