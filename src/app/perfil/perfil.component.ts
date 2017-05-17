import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { AuthService } from 'app/auth.service';
import { BloquearPantallaService }     from '../bloquear-pantalla/bloquear-pantalla.service';
import { CambiarEntornoService }     from '../perfil/cambiar-entorno.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  mostrar: boolean = false;
  usuario: any = {};
  mostrarCambiarEntorno:boolean = false;
  
  constructor(
    private router: Router,
    private authService:AuthService,
    private bloquearPantallaService: BloquearPantallaService,
    private cambiarEntornoService: CambiarEntornoService
  ) { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
  }

  toggle() {
    this.mostrar = !this.mostrar;
    if(this.mostrar){
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
    }
  }
  logout() {
    this.authService.logout();
     this.router.navigate(['/login']);
  }
  bloquear(){
   
    this.bloquearPantallaService.bloquearPantalla();
    this.mostrar = false;
  }

  seleccionarClues(value){
    this.mostrarCambiarEntorno = true;
    for(var i in this.usuario.unidades_medicas){
      
      if(value == this.usuario.unidades_medicas[i].clues){        
        this.usuario.clues_activa = this.usuario.unidades_medicas[i];
        if(this.usuario.clues_activa.almacenes.length >0){
          this.usuario.almacen_activo = this.usuario.clues_activa.almacenes[0];
        } else {
          this.usuario.almacen_activo = null;
        }        
      }
    }
    
  }

  seleccionarAlmacen(value){
    this.mostrarCambiarEntorno = true;
    for(var i in this.usuario.clues_activa.almacenes){
      if(value == this.usuario.clues_activa.almacenes[i].id){
        this.usuario.almacen_activo = this.usuario.clues_activa.almacenes[i];
      }
    }
  }

  cambiarEntorno(){
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
    this.mostrarCambiarEntorno = false;
    this.cambiarEntornoService.cambiarEntorno();
  }
}
