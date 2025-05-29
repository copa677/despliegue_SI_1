import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DetalleBoletaCompra } from '../interfaces/detalle_boleta_compra';
import { BoletacompraService } from '../../services/boletacompra.service';
import { Boleta_Compra } from '../interfaces/boleta_compra';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-boleta-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boleta-compra.component.html',
  styleUrl: './boleta-compra.component.css'
})
export class BoletaCompraComponent implements OnInit{
  
  nombre_administrador:string = "";
  nombre_proveedor:string = "";
  metodo_pago: string="QR";
  fecha: Date=new Date;
  total: number=0;
  codigo:number;

  listdetalleBoletaCompra: DetalleBoletaCompra[]=[];
  listcompra: Boleta_Compra[]=[];

  constructor(
    private toastr :ToastrService,
    private aRouter: ActivatedRoute,
    private router: Router,
    private _boletaCompraServices: BoletacompraService,
  ){
    this.codigo = Number(this.aRouter.snapshot.paramMap.get('cod'));
  }

  ngOnInit(): void {
    this.getlisDetalleBoletaCompra();
    this.getListBoletaCompra();
  }

  getlisDetalleBoletaCompra(){
    this._boletaCompraServices.getDetallesBoletaCompra(this.codigo).subscribe((data:DetalleBoletaCompra[])=>{
      this.listdetalleBoletaCompra=data;
    });
  }

  getListBoletaCompra(){
    this._boletaCompraServices.MostrarBoletasCompra().subscribe((data:Boleta_Compra[])=>{
      data.forEach((bol:Boleta_Compra)=>{
        this.nombre_administrador = bol.nombre_administrador,
        this.nombre_proveedor = bol.nombre_proveedor, 
        this.metodo_pago = bol.metodo_pago_nombre,
        this.fecha = bol.fecha!,
        this.total = bol.total!
      })
    });
  }

}
