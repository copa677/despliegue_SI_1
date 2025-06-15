import { Component, OnInit } from '@angular/core';
import { Factura } from '../interfaces/factura';
import { PermisosService } from '../../services/permisos.service';
import { FacturaService } from '../../services/factura.service';
import { ToastrService } from 'ngx-toastr';
import { Permiso } from '../interfaces/permiso';
import { BitacoraService } from '../../services/bitacora.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-vender',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vender.component.html',
  styleUrls: ['./vender.component.css']
})
export class VenderComponent implements OnInit{
  insertar: boolean = false;

  eliminar: boolean = false;
  username: string = "";

  listfactura: Factura[]=[];

  constructor (
    private _permiso:PermisosService,
    private _facturaServices:FacturaService,
    private toastr:ToastrService,
    private _bitacoraServices: BitacoraService,
  ){

  }

  ngOnInit(): void {
    this.getListFactura();
    this.getUsernameFromToken();
    this.getPermisos();
  }

  getPermisos(){
    this._permiso.getPermiso(this.username,"vender").subscribe((data: Permiso[])=>{
      data.forEach((perm:Permiso)=>{
        this.insertar=perm.perm_insertar;
        this.eliminar=perm.perm_eliminar;
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

  getListFactura(){
    this._facturaServices.MostrarFacturas().subscribe((data:Factura[])=>{
      this.listfactura=data;
    });
  }

  deleteFactura(cod:number,cliente: string){
    this._facturaServices.delete_Factura_Detalle(cod).subscribe(()=>{
      this.toastr.warning('Factura Eliminada con Existo',"Factura Eliminada");
        this._bitacoraServices.ActualizarBitacora(`Elimino la factura del cliente ${cliente}`)
      
      this.getListFactura();
    })
  }
  
}



