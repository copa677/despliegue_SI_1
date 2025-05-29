import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../app/interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private myAppUrl: String;
  private myApiUrl: String;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/users';
  }

  newUser(user: User):Observable<string> {
    //console.log(user);
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/newUser`,user);
  }

  newPassword(user: User):Observable<string> {
    //console.log(user);
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/newPassword`,user);
  }

  login(user: User):Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}/login`,user);
  }

  getUsers():Observable<User[]> {
    return this.http.get<User[]>(`${this.myAppUrl}${this.myApiUrl}/getusers`);
  }

  getNombreAdmin():Observable<string> {
    return this.http.get<string>(`${this.myAppUrl}${this.myApiUrl}/getAdmin`);
  }
}
