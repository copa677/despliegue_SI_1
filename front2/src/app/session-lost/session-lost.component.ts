import { Component, HostListener, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { Subscription } from 'rxjs';
import { BitacoraService } from '../../services/bitacora.service';
import { Bitacora } from '../interfaces/bitacora';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-session-lost',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-lost.component.html',
  styleUrls: ['./session-lost.component.css']
})
export class SessionLostComponent implements OnInit, OnDestroy, AfterViewInit {

  username: string = "";
  IP: string = "";
  fechaHora: string = this.obtenerFechaHoraActual();
  inactivityTimeout: any;
  inactivityModal: any;
  isLoginRoute: boolean = false;
  routerSubscription: Subscription;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private _bitacoraServices: BitacoraService
  ) {
    if (localStorage.getItem('isReload')) {
      localStorage.removeItem('isReload');
    }

    // Suscribirse a los eventos de navegación para detectar la ruta actual
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginRoute = this.router.url === '/login';
        if (this.isLoginRoute) {
          // Verificar si hay un token cuando se encuentra en la página de login
          const token = localStorage.getItem('token');
          if (token) {
            this.showLogoutConfirmationModal();
          }
          this.clearInactivityTimer();
        } else {
          this.resetInactivityTimer();
        }
      }
    });
  }

  ngOnInit() {
    if (!this.isLoginRoute) {
      window.addEventListener('online', this.updateOnlineStatus);
      window.addEventListener('offline', this.updateOnlineStatus);
      this.resetInactivityTimer();
      this.setupActivityListeners();
    }
  }

  ngAfterViewInit() {
    if (!this.isLoginRoute) {
      const modalElement = document.getElementById('sessionModal');
      if (modalElement) {
        this.inactivityModal = new bootstrap.Modal(modalElement, {
          keyboard: false,
          backdrop: 'static'
        });
      } else {
        console.error('El elemento del modal no se encontró en el DOM.');
      }
    }
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
    this.removeActivityListeners();
    clearTimeout(this.inactivityTimeout);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    if (!this.isLoginRoute) {
      localStorage.setItem('isReload', 'true');
    }
  }

  updateOnlineStatus = (event: Event) => {
    if (!this.isLoginRoute && !navigator.onLine) {
      this.logSessionClosure("Cierre de sesión por pérdida de conexión");
    }
  }

  private resetInactivityTimer = () => {
    clearTimeout(this.inactivityTimeout);
    if (!this.isLoginRoute) {
      this.inactivityTimeout = setTimeout(() => {
        if (this.inactivityModal) {
          this.inactivityModal.show();
        }
      }, 20000); // 20 segundos de inactividad
    }
  }

  private clearInactivityTimer() {
    clearTimeout(this.inactivityTimeout);
  }

  private setupActivityListeners() {
    document.addEventListener('mousemove', this.resetInactivityTimer);
    document.addEventListener('keypress', this.resetInactivityTimer);
    document.addEventListener('click', this.resetInactivityTimer);
    document.addEventListener('scroll', this.resetInactivityTimer);
  }

  private removeActivityListeners() {
    document.removeEventListener('mousemove', this.resetInactivityTimer);
    document.removeEventListener('keypress', this.resetInactivityTimer);
    document.removeEventListener('click', this.resetInactivityTimer);
    document.removeEventListener('scroll', this.resetInactivityTimer);
  }

  extendSession() {
    if (this.inactivityModal) {
      this.inactivityModal.hide();
    }
    this.resetInactivityTimer();
    this.router.navigate(['/home']); // Redirigir al home al extender la sesión
  }

  endSession() {
    if (this.inactivityModal) {
      this.inactivityModal.hide();
    }
    this.logout(); // Llamar al método logout al finalizar la sesión
  }

  logout() {
    // Eliminar el token y redirigir al inicio
    this.logSessionClosure("Cerró Sesion");
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  showLogoutConfirmationModal() {
    if (this.inactivityModal) {
      this.inactivityModal.show();
    }
  }

  private logSessionClosure(reason: string) {
    this.getUsernameFromToken();
    if (!localStorage.getItem('isReload')) {
      const bitacora: Bitacora = {
        nombre_usuario: this.username,
        ip: this.IP,
        fechahora: this.fechaHora,
        descripcion: reason
      };

      this._bitacoraServices.newBitacora(bitacora).subscribe(()=>{

      });
      localStorage.removeItem('token');
    }
  }

  obtenerFechaHoraActual(): string {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES');
    const hora = now.toLocaleTimeString('es-ES');
    return `${fecha} ${hora}`;
  }

  getUsernameFromToken() {
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
  OptenerIP() {
    this._bitacoraServices.obtenerDireccionIP().subscribe(
      response => {
        this.IP = response;
      },
      error => {
        this.toastr.error('Error al obtener la IP:', error);
      }
    );
  }
}
