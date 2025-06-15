import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../interfaces/product';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { NotaSalidaService } from '../../services/nota-salida.service';
import { NotaSalida } from '../interfaces/nota_salida';
import { DetalleNotaSalida } from '../interfaces/detalle_nota_salida';
import { BitacoraService } from '../../services/bitacora.service';
import { Permiso } from '../interfaces/permiso';
import { PermisosService } from '../../services/permisos.service';
import { ErrorService } from '../../services/error.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upd-new-nota-salida',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './upd-new-nota-salida.component.html',
  styleUrl: './upd-new-nota-salida.component.css'
})
export class UpdNewNotaSalidaComponent implements OnInit{

  getSuces: boolean=true;

  username: string = "";
  editar: boolean = false;

  origen: string = '';
  descripcion: string = '';
  cod_salida: number = 0;

  listproducts: Product[] = [];
  lisNotaSalida: NotaSalida[]=[];
  listDetNosaSalida: DetalleNotaSalida[]=[];

  detallesAEliminar: number[] = [];
  productoEditandoIndex: number = -1;

  productoSeleccionado: Product={
    categoria: "",
    marca: "",
    stock:0,
    precio_compra: 0,
    precio_venta:0,
    fecha_vencimiento: new Date
  };
  cantidadSeleccionada: number = 1;
  productosSeleccionados: { producto: Product, cantidad: number,codDetNS?:number}[] = [];
  i: number = -1;
  cod: number;
  operacion:string = 'Agregar ';
  cod_detalleNotaSalida: number=0;

  constructor(
    private _productServices: ProductoService,
    private _permisoServices: PermisosService,
    private toastr: ToastrService,
    private _NotaSalidaServices: NotaSalidaService,
    private aRouter: ActivatedRoute,
    private _DetalleSalidaServices: NotaSalidaService,
    private _bitacoraServices:BitacoraService,
    private errorService: ErrorService,
    private router: Router,
  ){
    this.cod = Number(this.aRouter.snapshot.paramMap.get('cod'));
  }
  ngOnInit(): void {
    if(this.cod!=0){
      this.operacion='Modificar';
      this.getListDetalleNotaSalida();
      this.getNotaSalida();
    }
    this.getListProducto();
    this.getUsernameFromToken();
    this.getPermisos();
  }

  getPermisos() {
    this._permisoServices.getPermiso(this.username, "notasalida").subscribe(
      (data: Permiso[]) => {
        data.forEach((perm: Permiso) => {
          this.editar = perm.perm_editar!;
        });
      },
      (error) => {
        this.errorService.msjError(error); // Usa el servicio de errores para manejar errores
      }
    );
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
    if (this.productoSeleccionado && this.cantidadSeleccionada > 0) {
      if (this.productoEditandoIndex !== -1) {
        this.productosSeleccionados[this.productoEditandoIndex].producto = this.productoSeleccionado;
        this.productosSeleccionados[this.productoEditandoIndex].cantidad = this.cantidadSeleccionada;
        // Resetea el índice de edición
        this.productoEditandoIndex = -1;
      }else{
        const encontrado = this.productosSeleccionados.find(item => item.producto === this.productoSeleccionado);
        if (encontrado) {
          encontrado.cantidad += this.cantidadSeleccionada;
        } else {
          this.productosSeleccionados.push({
            producto: this.productoSeleccionado,
            cantidad: this.cantidadSeleccionada,
          });
        }
      }
    }
  }


  eliminarProducto(producto: { producto: Product, cantidad: number, codDetNS?: number}) {
    const index = this.productosSeleccionados.indexOf(producto);
    if (index !== -1) {
      this.productosSeleccionados.splice(index, 1);
      if (this.cod !== 0 && producto.codDetNS) {
        this.detallesAEliminar.push(producto.codDetNS);
      }
    }
  }
  
  

  getListProducto(){
    this._productServices.getProducts().subscribe((data:Product[])=>{
      this.listproducts=data;
      this.listDetNosaSalida.forEach(detalle => {
        const productoEncontrado = this.listproducts.find(producto => producto.categoria === detalle.nombre_producto);
        if (productoEncontrado) {
          this.productosSeleccionados.push({
            producto: productoEncontrado,
            cantidad: detalle.cantidad,
            codDetNS: detalle.cod_detalle // Suponiendo que hay un campo cod_detalle en DetalleNotaSalida
          });
        }
      });
    })
  }

  getListDetalleNotaSalida() {
    this._NotaSalidaServices.getDetalleNotaSalida(this.cod).subscribe(
      (data: DetalleNotaSalida[]) => {
        this.listDetNosaSalida = data;
      },
      (error) => {
        this.errorService.msjError(error); // Usa el servicio de errores para manejar errores
      }
    );
  }

  getNotaSalida() {
    this._NotaSalidaServices.getNotaSalida(this.cod).subscribe(
      (data: NotaSalida) => {
        this.origen = data.origen;
        this.descripcion = data.descripcion;
      },
      (error) => {
        this.errorService.msjError(error); // Usa el servicio de errores para manejar errores
      }
    );
  }

  confirm() {

    if(this.origen=="" || this.descripcion=="" || this.productosSeleccionados.length==0){
      this.toastr.error("Todos los campos son necesarios","Error");
      return;
    }

    const notasalida: NotaSalida = {
      origen: this.origen,
      descripcion: this.descripcion,
      fecha: new Date(),
    };
  
    if (this.cod !== 0) {
      // Eliminar producto si ya confirmó
      if (this.detallesAEliminar.length > 0) {
        const deleteRequests = this.detallesAEliminar.map(codDetNS =>
          this._DetalleSalidaServices.deleteDetalleNotaSalida(codDetNS).pipe(
            catchError(error => {
              this.errorService.msjError(error);
              return of(null); // Continuar con null si hay error
            })
          )
        );
  
        forkJoin(deleteRequests).subscribe(() => {
          this.updateNotaSalida(notasalida);
        });
      } else {
        this.updateNotaSalida(notasalida);
      }
    } else {
      this._NotaSalidaServices.newNotaSalida(notasalida).subscribe(
        (data: number) => {
          this.cod_salida = data;
          this.detNotaSalida().subscribe(
            success => {
              if (success) {
                this.toastr.success('Nota de salida creada con éxito', 'Nota de salida Creada');
                this._bitacoraServices.ActualizarBitacora(`Se insertó una nueva nota de salida con origen: ${notasalida.origen}`);
                this.router.navigate(['/home/notasalida']);
              } else {
                //this.eliminarNotaSalida(this.cod_salida);
                this._NotaSalidaServices.deleteNotasVacias().subscribe();
                this.getSuces=false;
              }
            },
            error => {
              //this.eliminarNotaSalida(this.cod_salida);
              this.getSuces=false;
              this._NotaSalidaServices.deleteNotasVacias().subscribe();
              this.errorService.msjError(error);
            }
          );
        },
        error => this.errorService.msjError(error)
      );
    }
    
  }
  
  eliminarNotaSalida(cod_salida: number) {
    this._NotaSalidaServices.deleteNotaSalida(cod_salida).subscribe(
      () => {
        this.toastr.error('Error al crear detalles de la nota de salida. La nota de salida ha sido eliminada.', 'Error');
      },
      error => {
        this.errorService.msjError(error);
      }
    );
  }
  
  updateNotaSalida(notasalida: NotaSalida) {
    this._NotaSalidaServices.UpdateNotaSalida(this.cod, notasalida).subscribe(
      () => {
        this.detNotaSalida().subscribe(
          success => {
            if (success) {
              this.toastr.success(`Nota de salida: ${this.cod} Actualizada con éxito`, 'Nota de salida Actualizada');
              this._bitacoraServices.ActualizarBitacora(`Actualizó nota de salida con origen: ${notasalida.origen}`);
            }
          },
          error => this.errorService.msjError(error) // Manejar error en detNotaSalida
        );
      },
      error => this.errorService.msjError(error) // Manejar error en UpdateNotaSalida
    );
  }
  
  detNotaSalida() {
    const requests = this.productosSeleccionados.map(item => {
      const detNotaSalida: DetalleNotaSalida = {
        cod_detalle: item.codDetNS,
        cod_salida: this.cod !== 0 ? undefined : this.cod_salida, // Asegurar que sea undefined si no es 0
        nombre_producto: item.producto.categoria,
        cantidad: item.cantidad,
      };
  
      const observable = item.codDetNS ?
        this._DetalleSalidaServices.updateDetalleNotaSalida(detNotaSalida) :
        this._DetalleSalidaServices.newDetalleNotaSalida(detNotaSalida);
  
      return observable.pipe(
        map(() => true), // Indicar éxito
        catchError(error => {
          this.errorService.msjError(error);
          return of(false); // Indicar fallo
        })
      );
    });
  
    return forkJoin(requests).pipe(
      map(results => results.every(result => result === true)) // Devuelve true si todos los observables tuvieron éxito
    );
  }
  
  

  edpr(producto: { producto: Product, cantidad: number, codDetNS?: number}, index: number) {
    this.productoSeleccionado = producto.producto;
    this.cantidadSeleccionada = producto.cantidad;
    this.productoEditandoIndex = index;
  }

}
