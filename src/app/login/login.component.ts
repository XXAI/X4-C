import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import { AuthService } from 'app/auth.service';
import { BloquearPantallaService }     from '../bloquear-pantalla/bloquear-pantalla.service';


import { ESTA_SALUD_ID_DISPONIBLE } from 'app/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  saludIdDisponible: boolean;
  credenciales: any = {};
  loading: boolean = false;
  private returnUrl: string;
  mensaje: string = "";
  mostrarMensaje: boolean = false;
  private bloquearPantallaSuscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService,
    private bloquearPantallaService: BloquearPantallaService
  ) { 
    this.bloquearPantallaSuscription = bloquearPantallaService.pantallaBloqueada$.subscribe(bloquear => {
      // Borramos el token porque de todos modos se va a sustituir
      // y así impedimos que intenten borrar elementos en el navegador para acceder
      if(!bloquear){
        console.log("Redirigindo desde login por desbloqueo de pantalla")
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([this.returnUrl]);
      }
      
    });
  }

  ngOnInit() {
    this.saludIdDisponible = ESTA_SALUD_ID_DISPONIBLE;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  login() {
    this.loading = true;
    this.mostrarMensaje = false;
    

    this.authService.login(this.credenciales.id, this.credenciales.password)
      .subscribe(
       

        data => {
          this.loading = false;
          this.router.navigate([this.returnUrl]);
          localStorage.removeItem('bloquear_pantalla');
        },
        error => {
          this.loading = false;
          this.mostrarMensaje = true;
          
          this.mensaje = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
          try {
            let e = error.json();
            
            if (error.status == 401){
              this.mensaje = "Lo sentimos el usuario y/o contraseña no son válidos."
            }

            if (error.status == 0){
              this.mensaje = "Conexión rechazada."
            }

            if (error.status == 500 ){
              this.mensaje = "500 (Error interno del servidor)";
            } 
          } catch(e){
            if (error.status == 500 ){
              this.mensaje = "500 (Error interno del servidor)";
            } 
          }
          
        }
      );
  }

}
