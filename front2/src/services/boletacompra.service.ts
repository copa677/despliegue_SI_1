import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Boleta_Compra } from '../app/interfaces/boleta_compra';
import { Observable } from 'rxjs';
import { DetalleBoletaCompra } from '../app/interfaces/detalle_boleta_compra';
@Injectable({
  providedIn: 'root'
})
export class BoletacompraService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/boletacompra';
  }

  newBoletaCompra(boleta_compra: Boleta_Compra):Observable<number>{
    return this.http.post<number>(`${this.myAppUrl}${this.myApiUrl}/newBoletaCompra`,boleta_compra);
  }

  newDetalleBoletaCompra(detallefactura: DetalleBoletaCompra):Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/newDetallesBoletaCompra`,detallefactura);
  }

  MostrarBoletasCompra():Observable<Boleta_Compra[]>{
    return this.http.get<Boleta_Compra[]>(`${this.myAppUrl}${this.myApiUrl}/MostrarBoletasCompra`);
  }

  getBoletaCompra(cod:number):Observable<Boleta_Compra[]>{
    return this.http.get<Boleta_Compra[]>(`${this.myAppUrl}${this.myApiUrl}/getBoletaCompra/${cod}`);
  }

  getDetallesBoletaCompra(cod:number):Observable<DetalleBoletaCompra[]>{
    return this.http.get<DetalleBoletaCompra[]>(`${this.myAppUrl}${this.myApiUrl}/getDetallesBoletaCompra/${cod}`);
  }

  delete_BoletaCompra_Detalle(cod:number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/deleteBoletaCompra/${cod}`);
  }

}
