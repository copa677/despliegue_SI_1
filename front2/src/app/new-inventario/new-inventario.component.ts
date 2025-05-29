import { Component, OnInit } from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { Almacen } from '../interfaces/almacen';
import { AlmacenServices } from '../../services/almacen.service';
import { Inventario } from '../interfaces/inventario';
import { InventarioService } from '../../services/inventario.service';
import { BitacoraService } from '../../services/bitacora.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-inventario.component.html',
  styleUrl: './new-inventario.component.css'
})
export class NewInventarioComponent implements OnInit{

  listAlamcen: Almacen[]=[]
  listproducts: Product[]=[]


  alamcenSeleccionado: Almacen={
    nombre:"",
    direccion:"",
    ciudad:"",
    capacidad_actual:0,
    capacidad_total:0,
  };

  productoSeleccionado: Product={
    categoria: "",
    marca: "",
    stock:0,
    precio_compra: 0,
    precio_venta:0,
    fecha_vencimiento: new Date
  };

  cantidadSeleccionada: number = 1;
  almacenSeleccionados: { almacen: Almacen}[] = [];
  productosSeleccionados: { producto: Product, cantidad: number, subtotal: number }[] = [];


  constructor(
    private _productServices: ProductoService,
    private _alamcenServices: AlmacenServices,
    private _inventarioServices: InventarioService,
    private toastr: ToastrService,
    private _bitacoraServices: BitacoraService,
  ){

  }
  ngOnInit(): void {
    this.getListProducto();
    this.getListAlmacenes();
  }

  getListProducto(){
    this._productServices.getProducts().subscribe((data:Product[])=>{
      this.listproducts=data;
    })
  }

  getListAlmacenes(){
    this._alamcenServices.getlistAlmacenes().subscribe((data)=>{
      this.listAlamcen=data;
    })
  }

  newInventario(){
    const inventario: Inventario={
      nombre_almacen: this.alamcenSeleccionado.nombre,
      nombre_producto: this.productoSeleccionado.categoria,
      cantidad: this.cantidadSeleccionada,
      fecha:new Date,
    }

    this._inventarioServices.newInventario(inventario).subscribe(()=>{
      this.toastr.show(`Inventario del producto: ${inventario.nombre_producto} añadido con exito`,"Inventario añadido")
      this._bitacoraServices.ActualizarBitacora(`Añadió el inventario del producto: ${inventario.nombre_producto}`);
    })
    
  }
}
