import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { Almacen } from '../app/interfaces/almacen';

@Injectable({
  providedIn: 'root'
})
export class AlmacenServices {
  private myAppUrl: String;
  private myApiUrl: String;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/almacen/';
   }

  getlistAlmacenes():Observable<Almacen[]> {
    return this.http.get<Almacen[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  deleteAlmacen(id:number):Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`)
  }

  newAlmacen(alamcen:Almacen):Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`,alamcen);
  }

  getAlmacen(id:number):Observable<Almacen> {
    return this.http.get<Almacen>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  UpdateAlmacen(id:number,alamcen:Almacen):Observable<void> {
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}${id}`,alamcen);
  }
}
