import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';
import { User } from '../app/interfaces/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { Permiso } from '../app/interfaces/permiso';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  username: string = '';
  private myAppUrl: String;
  private myApiUrl: String;

  constructor(
    private toastr: ToastrService,
    private http: HttpClient
  ) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/permisos';
  }

  private getUsernameFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        this.username = payload.username;
      } else {
        this.toastr.error('El token no tiene el formato esperado.', 'Error');
      }
    } else {
      this.toastr.error('No se encontró un token en el localStorage.', 'Error');
    }
  }

  newPermiso(perm: Permiso):Observable<void> {
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/newpermisos`,perm);
  }

  updatePermiso(perm: Permiso):Observable<void> {
    console.log(perm);
    
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}/updatepermiso`,perm);
  }

  getPermiso(username:string,vista:string):Observable<Permiso[]> {
    //console.log(username,vista); 
    return this.http.post<Permiso[]>(`${this.myAppUrl}${this.myApiUrl}/getpermisos`,{username,vista});
  }

}
