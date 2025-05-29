import { Component, OnInit } from '@angular/core';
import { Proveedores } from '../interfaces/proveedores';
import { ProveedoresService } from '../../services/proveedores.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BitacoraService } from '../../services/bitacora.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-new-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-new-proveedor.component.html',
  styleUrl: './add-new-proveedor.component.css'
})
export class AddNewProveedorComponent implements OnInit{
  
  codigo:number;
  operacion:string = 'Agregar ';

  constructor(private _proveedorServices: ProveedoresService,
    private toastr: ToastrService,
    private aRouter: ActivatedRoute,
    private router: Router,
    private _bitacoraServices:BitacoraService
    )
  {
      this.codigo = Number(this.aRouter.snapshot.paramMap.get('codigo'));
  }
  ngOnInit(): void {
    if(this.codigo!=0){
      this.operacion='Modificar';
      this.getProveedor(this.codigo);
    }
  }

 

  nombre: string = '';
  direccion: string = '';
  telefono: string = '';

  proveedores: Proveedores[] = [];

  validarYAgregarProveedor(): void {
    if (this.nombre && this.direccion && this.telefono) {
      this.proveedores.push({
        nombre: this.nombre,
        direccion: this.direccion,
        telefono: this.telefono,
      });
      this.nombre = '';
      this.direccion = '';
      this.telefono = '';
    } else {
      alert("Por favor, complete todos los campos.");
    }
  }

  

  newProveedor(){
    const proveedor:Proveedores = {
      nombre: this.nombre, 
      direccion: this.direccion,
      telefono: this.telefono
    }

    if(this.codigo!=0){
      //modificar
      proveedor.codigo=this.codigo;
      this._proveedorServices.UpdateProveedor(this.codigo,proveedor).subscribe(()=>{
        this.toastr.success(`El Proveedor: ${proveedor.nombre}, fue actualizado con exito`,'Proveedor Actualizado'); 
        this._bitacoraServices.ActualizarBitacora(`Actualizo los datos del Proveedor: ${proveedor.nombre}`);
        this.router.navigate(['home/proveedores']);
      })
    }else{
      //agregar
      this._proveedorServices.newProveedor(proveedor).subscribe(()=>{
        this.toastr.success(`El Proveedor: ${proveedor.nombre}, fue registrado con exito`,'Proveedor Registrado');
        this._bitacoraServices.ActualizarBitacora(`Registro los Datos del Nuevo Proveedor: ${proveedor.nombre}`);
        this.router.navigate(['home/proveedores']);
      })
    }
    

  }

  getProveedor(codigo:number){
    this._proveedorServices.getProveedor(codigo).subscribe((data:Proveedores)=>{
      this.nombre=data.nombre;
      this.direccion=data.direccion;
      this.telefono=data.telefono;
    })
  }

  navegar(){
    this.router.navigate(['/home/proveedores']);
  }

}
