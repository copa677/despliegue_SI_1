import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { BitacoraService } from '../../services/bitacora.service';
import { ErrorService } from '../../services/error.service';
import { Product } from '../interfaces/product';
import { Proveedores } from '../interfaces/proveedores';
import { ProveedoresService } from '../../services/proveedores.service';
import { BoletacompraService } from '../../services/boletacompra.service';
import { Boleta_Compra } from '../interfaces/boleta_compra';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { DetalleBoletaCompra } from '../interfaces/detalle_boleta_compra';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-compra.component.html',
  styleUrl: './new-compra.component.css'
})
export class NewCompraComponent implements OnInit {
  
  username: string = "";
  metodoPago: string = "";
  descripcion: string = "";
  codboletacomp: number=0;

  precioSeleccionado: number = 0;
  listproducts: Product[] = [];
  listproveedores: Proveedores []=[];
  productoSeleccionado: Product={
    categoria: "",
    marca: "",
    stock:0,
    precio_compra: 0,
    precio_venta:0,
    fecha_vencimiento: new Date
  };
  proveedorSeleccionado: Proveedores = {
    codigo:0,
    nombre: "", 
    direccion: "",
    telefono: ""
  };
  cantidadSeleccionada: number = 1;
  productosSeleccionados: { producto: Product, cantidad: number,precio: number, subtotal: number }[] = [];

  constructor(
    private _productServices: ProductoService,
    private _proveedorServices: ProveedoresService,
    private toastr: ToastrService,
    private _bitacoraServices: BitacoraService,
    private errorService: ErrorService,
    private _boletaCompraServices: BoletacompraService,
    private router: Router,
  ){

  }

  ngOnInit(): void {
    this.getListProducto();
    this.getListProveedor();
    this.getUsernameFromToken();
  }

  getListProducto(){
    this._productServices.getProducts().subscribe((data:Product[])=>{
      this.listproducts=data;
    })
  }

  getListProveedor(){
    this._proveedorServices.getlistProveedores().subscribe((data:Proveedores[])=>{
      this.listproveedores=data;
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

  agregarProducto() {
    if(this.productoVacio()){
      this.toastr.error("Seleccione un producto","Error")
      return;
    }
    if(this.precioSeleccionado==0){
      this.toastr.error("Seleccione un precio Valido","Error")
      return;
    }
    if (this.productoSeleccionado && this.cantidadSeleccionada > 0) {
      const encontrado = this.productosSeleccionados.find(item => item.producto === this.productoSeleccionado);
      if (encontrado) {
        encontrado.cantidad += this.cantidadSeleccionada;
        encontrado.subtotal += this.precioSeleccionado * this.cantidadSeleccionada;
      } else {
        const subtotal = this.precioSeleccionado * this.cantidadSeleccionada;
        this.productosSeleccionados.push({
          producto: this.productoSeleccionado,
          precio: this.precioSeleccionado,
          cantidad: this.cantidadSeleccionada,
          subtotal: subtotal
        });
      }
    }
  }

  productoVacio():boolean{
    return this.productoSeleccionado.categoria==""||this.productoSeleccionado.marca=="" || this.productoSeleccionado==null
  }

  eliminarProducto(producto: { producto: Product, cantidad: number,precio: number, subtotal: number }) {
    const index = this.productosSeleccionados.indexOf(producto);
    if (index !== -1) {
      this.productosSeleccionados.splice(index, 1);
    }
  }

  calcularTotal() {
    let total = 0;
    this.productosSeleccionados.forEach(item => {
      total += item.subtotal;
    });
    return total;
  }

  ConfirmarCompra(){
    if(this.CamposVacios()){
      this.toastr.error("Todos los campos son Necesarios","Error")
      return;
    }
    const boleta_compra: Boleta_Compra = {
      nombre_proveedor: this.proveedorSeleccionado.nombre,
      nombre_administrador: this.username, 
      metodo_pago_nombre: this.metodoPago,
      descripcion: this.descripcion,
    };

    this._boletaCompraServices.newBoletaCompra(boleta_compra).subscribe(
      (data: any) => {
        const codboletacomp = data[0].insertar_boleta_compra;
        this.codboletacomp = codboletacomp;
  
        this.detalleBoletaCompra().subscribe(
          success => {
            if (success) {
              this.toastr.success('Boleta de Compra Añadida e Inventario Actualizado con Exito ', 'Boleta de Compra Añadida e INventario Actualizado');
              this._bitacoraServices.ActualizarBitacora(`Creó la Boleta de Compra del proveedor ${this.proveedorSeleccionado.nombre} y se actualizo el inventario de los productos`);
              this.router.navigate(['/home/comprar']);
            } else {
              this.eliminarBoletaCompra(codboletacomp);
            }
          },
          error => {
            this.eliminarBoletaCompra(codboletacomp);
            this.errorService.msjError(error);
          }
        );
      },
      (error: HttpErrorResponse) => {
        this.errorService.msjError(error);
      }
    );
    
  }

  eliminarBoletaCompra(codboletacomp: number){
    this._boletaCompraServices.delete_BoletaCompra_Detalle(codboletacomp).subscribe(
      () => {
        
      },
      error => {
        this.errorService.msjError(error);
      }
    );
  }

  detalleBoletaCompra(): Observable<boolean> {
    const requests = this.productosSeleccionados.map(item => {
      const detalleBoletaCompra: DetalleBoletaCompra = {
        NroBoleta: this.codboletacomp,
        nombre_producto: `${item.producto.categoria}`,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      };
      return this._boletaCompraServices.newDetalleBoletaCompra(detalleBoletaCompra).pipe(
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          this.errorService.msjError(error);
          return of(false);
        })
      );
    });
  
    return forkJoin(requests).pipe(
      map(results => results.every(result => result === true))
    );
  }
  
  CamposVacios():Boolean{
    return this.proveedorSeleccionado.nombre=="" || this.descripcion=="" || this.metodoPago=="" || this.productosSeleccionados.length==0
  }
}
