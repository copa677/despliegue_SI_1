import { Component, OnInit } from '@angular/core';
import { Boleta_Compra } from '../interfaces/boleta_compra';
import { PermisosService } from '../../services/permisos.service';
import { BoletacompraService } from '../../services/boletacompra.service';
import { ToastrService } from 'ngx-toastr';
import { BitacoraService } from '../../services/bitacora.service';
import { Permiso } from '../interfaces/permiso';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comprar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './comprar.component.html',
  styleUrl: './comprar.component.css'
})
export class ComprarComponent implements OnInit {

  insertar: boolean = false;
  eliminar: boolean = false;
  username: string = "";

  listcompra: Boleta_Compra[] = [];


  constructor(
    private _permiso: PermisosService,
    private _boletacompraServices: BoletacompraService,
    private toastr: ToastrService,
    private _bitacoraServices: BitacoraService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.getUsernameFromToken();
    this.getPermisos();
    this.getListBoletaCompra();
  }

  getPermisos() {
    this._permiso.getPermiso(this.username, "comprar").subscribe((data: Permiso[]) => {
      data.forEach((perm: Permiso) => {
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
        this.toastr.error('El token no tiene el formato esperado.', 'Error');
      }
    } else {
      this.toastr.error('No se encontró un token en el localStorage.', 'Error');
    }
  }

  getListBoletaCompra() {
    this._boletacompraServices.MostrarBoletasCompra().subscribe((data: Boleta_Compra[]) => {
      this.listcompra = data;
    });
  }

  deleteBoletaCompra(codBoletaCom: number, proveedor: string) {
    this._boletacompraServices.delete_BoletaCompra_Detalle(codBoletaCom).subscribe(() => {
      this.toastr.warning('Boleta de Compra Eliminada e Inventario Actualizado con Existo', "Boleta de Compra Eliminada");
      this._bitacoraServices.ActualizarBitacora(`Elimino la Boleta de Compra del proveedor: ${proveedor} y se Actualizo el Inventario de los productos`)
      this.getListBoletaCompra();
    })
  }
  verBoleta(nro: number | undefined) {
    if (nro !== undefined) {
      this.router.navigate(['/home/BoletaCompra', nro.toString()]);
    } else {
      this.toastr.error('Número de boleta no válido.', 'Error');
    }
  }

}
