import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Proveedores } from '../app/interfaces/proveedores';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/proveedor/';
  }

  getlistProveedores():Observable<Proveedores[]> {
    return this.http.get<Proveedores[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  deleteProveedor(codigo:number):Observable<void> {
    //console.log(codigo);
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${codigo}`)
  }

  newProveedor(proveedor:Proveedores):Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`,proveedor);
  }

  getProveedor(codigo:number):Observable<Proveedores> {
    return this.http.get<Proveedores>(`${this.myAppUrl}${this.myApiUrl}${codigo}`);
  }

  UpdateProveedor(codigo:number,proveedor:Proveedores):Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${codigo}`,proveedor);
  }
}
