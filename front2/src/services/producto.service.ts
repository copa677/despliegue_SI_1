import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Product } from '../app/interfaces/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private myAppUrl: String;
  private myApiUrl: String;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/producto';
   }

   newProduct(producto: Product):Observable<void>{
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/newProduct`,producto);
   }

   updateProduct(producto: Product):Observable<void>{
    //console.log(producto.categoria);
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/updateProduct`,producto);
   }

   deleteProduct(cod:number):Observable<void>{
    //console.log(producto.categoria);
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${cod}`);
   }

   getProducts():Observable<Product[]>{
    //console.log(producto);
    return this.http.get<Product[]>(`${this.myAppUrl}${this.myApiUrl}/getProduct`); 
   }
}
