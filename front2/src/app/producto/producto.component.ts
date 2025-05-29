// producto.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { Data, Router } from '@angular/router';
import { ErrorService } from '../../services/error.service';
import { Product } from '../interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { PermisosService } from '../../services/permisos.service';
import { BitacoraService } from '../../services/bitacora.service';
import { Permiso } from '../interfaces/permiso';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit{
  categoria: string = '';
  marca: string = '';
  stock: number = 0;
  precioCompra: number = 0;
  precioVenta: number = 0;
  fechaVencimiento: Date|null = new Date();

  listproductos: Product[] = [];
  categorias: string[] = ['Capuchon de triceta','Capuchon de junta', 'Grasa Lubricante','Grasa Grafitada', 'Reten Cigueñal'];
  marcas: string[] = ['Golden', 'Nisan'];
  RegUp:boolean = false;
  cod:number = 0;

  insertar: boolean = false;
  editar: boolean = false;
  eliminar: boolean =false;
  username: string = "";

  constructor(private toastr: ToastrService,
    private _productService: ProductoService,
    private router: Router,
    private _permiso:PermisosService,
    private _errorServices: ErrorService,
    private _bitacoraServices: BitacoraService){ }

  ngOnInit(): void {
    this.getListProduct();
    this.getUsernameFromToken();
    this.getPermisos();
  }
  
  getPermisos(){
    this._permiso.getPermiso(this.username,"producto").subscribe((data:Permiso[])=>{
      data.forEach((perm: Permiso)=>{
        this.insertar = perm.perm_insertar;
        this.eliminar = perm.perm_eliminar;
        this.editar = perm.perm_editar!;
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
  
  registrarProducto(): void {
    if(this.fechaVencimiento instanceof Date){
      this.fechaVencimiento=null;
    }
    const product: Product = {
      cod:this.cod,
      marca: this.marca, 
      categoria: this.categoria, 
      stock: this.stock, 
      precio_compra: this.precioCompra, 
      precio_venta: this.precioVenta, 
      fecha_vencimiento: this.fechaVencimiento
    }


    //console.log(product);
    
    if (this.productoInvalido()) {
      this.toastr.error("Por favor, complete todos los campos.",'Error');
      return;
    }


    if(this.RegUp){
      this._productService.updateProduct(product).subscribe(
        (data: any) => {
          // Manejar la respuesta exitosa aquí  
          this.limpiarCampos();
          this.getListProduct();
          this.toastr.info(`Producto ${this.categoria} Actualizado con exito`,'Producto Actualizado')
        },
        (error: HttpErrorResponse) => {
          // Manejar el error aquí
          this._errorServices.msjError(error);
        } 
      );
      this.RegUp=false;
      this._bitacoraServices.ActualizarBitacora(`Actualizo el Producto: ${this.categoria}`);
    }else{
      this._productService.newProduct(product).subscribe(
        (data: any) => {
          // Manejar la respuesta exitosa aquí  
          this.limpiarCampos();
          this.getListProduct();
          this.toastr.success(`Producto ${this.categoria} Añadido con exito`,'Producto añadido')
        },
        (error: HttpErrorResponse) => {
          // Manejar el error aquí
          this._errorServices.msjError(error);
        } 
      );
      this._bitacoraServices.ActualizarBitacora(`Registro el Nuevo Producto: ${this.categoria}`);
    }

    

  }

  PusProduct(product: Product,cod:number) {
    
    this.cod = cod
    this.marca = product.marca;
    this.categoria = product.categoria;
    this.stock = product.stock;
    this.precioCompra = product.precio_compra;
    this.precioVenta = product.precio_venta;
    this.fechaVencimiento = product.fecha_vencimiento;
    this.RegUp=true;
    //updateProduct(item.cod!,item.marca!,item.categoria!,item.stock,item.precio_compra,item.precio_venta,item.fecha_vencimiento)
  }


  deleteProduct(cod:number,pr:string){
    this._productService.deleteProduct(cod).subscribe(()=>{
      this.toastr.warning('Eliminado con Existo')
      this.getListProduct();
      this._bitacoraServices.ActualizarBitacora(`Eliminó el Producto: ${pr}`);
    },error =>{
      this._errorServices.msjError(error);
    })
  }

  getListProduct(): void{
    this._productService.getProducts().subscribe((data:Product[])=>{
      this.listproductos=data;      
    },error =>{
      this._errorServices.msjError(error);
    })
  }


  productoInvalido(): boolean {
    return this.categoria == '' || this.marca == '' || this.stock == 0 && this.precioCompra == 0 && this.precioVenta == 0;
  }
  

  limpiarCampos() {
    this.categoria = '';
    this.marca = '';
    this.stock = 0;
    this.precioCompra = 0;
    this.precioVenta = 0;
    this.fechaVencimiento = new Date();
  }
}
