import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Factura } from '../app/interfaces/factura';
import { DetalleFactura } from '../app/interfaces/detallefactura';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private myAppUrl: String;
  private myApiUrl: String;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/factura';
  }


  newFactura(factura: Factura):Observable<number>{
   return this.http.post<number>(`${this.myAppUrl}${this.myApiUrl}/newFactura`,factura);
  }

  newDetalleFactura(detallefactura: DetalleFactura):Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/DetalleFactura`,detallefactura);
  }

  MostrarFacturas():Observable<Factura[]>{
    return this.http.get<Factura[]>(`${this.myAppUrl}${this.myApiUrl}/MostrarFacturas`);
  }

  getFactura(cod:number):Observable<Factura[]>{
    return this.http.get<Factura[]>(`${this.myAppUrl}${this.myApiUrl}/getFactura/${cod}`);
  }

  getDetallesFactura(cod:number):Observable<DetalleFactura[]>{
    return this.http.get<DetalleFactura[]>(`${this.myAppUrl}${this.myApiUrl}/getDetalleFactura/${cod}`);
  }

  delete_Factura_Detalle(cod:number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${cod}`);
  }

  MostrarClientes():Observable<string>{
    return this.http.get<string>(`${this.myAppUrl}${this.myApiUrl}/MostrarClientes`);
  }
}
