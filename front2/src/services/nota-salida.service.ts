import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { NotaSalida } from '../app/interfaces/nota_salida';
import { DetalleNotaSalida } from '../app/interfaces/detalle_nota_salida';
@Injectable({
  providedIn: 'root'
})
export class NotaSalidaService {
  private myAppUrl: String;
  private myApiUrl: String;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/notasalida';
  }

  newNotaSalida(notasalida: NotaSalida):Observable<number>{
    return this.http.post<number>(`${this.myAppUrl}${this.myApiUrl}/newNotaSalida`,notasalida);
  }
  getNotasSalida():Observable<NotaSalida[]>{
    return this.http.get<NotaSalida[]>(`${this.myAppUrl}${this.myApiUrl}/getNotasSalida`);
  }
  getNotaSalida(cod:number):Observable<NotaSalida>{
    return this.http.get<NotaSalida>(`${this.myAppUrl}${this.myApiUrl}/getNotaSalida/${cod}`);
  }
  UpdateNotaSalida(cod:number,notasalida: NotaSalida):Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/updateNotaSalida/${cod}`,notasalida);
  }
  deleteNotaSalida(cod:number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/deleteNotaSalida/${cod}`);
  }
/*---------------------------------------------------------------------------------------------------------*/
  newDetalleNotaSalida(detallesalida: DetalleNotaSalida):Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/newDetNotaSalida`,detallesalida);
  }
  getDetalleNotaSalida(cod: number):Observable<DetalleNotaSalida[]>{
    return this.http.get<DetalleNotaSalida[]>(`${this.myAppUrl}${this.myApiUrl}/getDetsNotaSalida/${cod}`); 
  }
  updateDetalleNotaSalida(detallesalida: DetalleNotaSalida):Observable<void>{
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}/updateDeNotaSalida`,detallesalida);
  }
  deleteDetalleNotaSalida(cod:number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/deleteDeNotaSalida/${cod}`);
  }
  deleteNotasVacias():Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/deleteNotasVacias`);
  }
}
