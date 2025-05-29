import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { Bitacora } from '../app/interfaces/bitacora';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {
  private myAppUrl: String;
  private myApiUrl: String;
  
  username: string = '';
  IP: string = "";
  fechaHora:string = this.obtenerFechaHoraActual();

  constructor(private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/bitacora';
    this.OptenerIP();
  }


  obtenerDireccionIP(): Observable<string> {
    return this.http.get<any>('https://api.ipify.org/?format=json').pipe(
      map(response => response.ip) // Extrae la propiedad 'ip' del objeto JSON de respuesta
    );
  }

  obtenerFechaHoraActual(): string {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES');
    const hora = now.toLocaleTimeString('es-ES');
    return `${fecha} ${hora}`;
  }

  newBitacora(bitacora: Bitacora):Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/newBitacora`,bitacora);
  }
  getBitacora():Observable<Bitacora[]>{
    return this.http.get<Bitacora[]>(`${this.myAppUrl}${this.myApiUrl}/getBitacora`); 
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

  OptenerIP() {
    this.obtenerDireccionIP().subscribe(
      response => {
        this.IP=response;
      },
      error => {
        this.toastr.error('Error ip:', error);
      }
    );
  }

  ActualizarBitacora(descripcion:string){
    this.OptenerIP();
    this.getUsernameFromToken()
    const bitacora:Bitacora={
      nombre_usuario:this.username,
      ip:this.IP,
      fechahora:this.obtenerFechaHoraActual(),
      descripcion: descripcion
    } 
    this.newBitacora(bitacora).subscribe()
  }

  getApiUrl(): string {
    return `${this.myAppUrl}${this.myApiUrl}/newBitacora`;
  }

}

