import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Inventario } from '../app/interfaces/inventario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private myAppUrl: String;
  private myApiUrl: String;
  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/inventario';
   }

  newInventario(inventario: Inventario):Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/newInventario`,inventario);
  }
  getInventarios():Observable<Inventario[]>{
    return this.http.get<Inventario[]>(`${this.myAppUrl}${this.myApiUrl}/getInventarios`);
  }
  deleteInventarios(numero_Inventario:number):Observable<void>{
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${numero_Inventario}`);
  }
}
