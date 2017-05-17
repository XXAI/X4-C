import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { CrudService } from './crud.service';

import { Mensaje } from '../mensaje';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'nuevo',
  template: '<simple-notifications [options]="options"></simple-notifications>'
})

export class NuevosComponent implements OnInit {

  //@Input()
  //usuario: Usuario = new Usuario();

  private cargando: boolean = false;

  // # SECCION: Esta sección es para mostrar mensajes
  mensajeResponse: Mensaje = new Mensaje(true);
  // # FIN SECCION
  @Input() URL: string;
  @Input() titulo: string;
  @Input() dato: FormGroup;
  constructor(
    private router: Router,
    private title: Title,
    private crudService: CrudService,
    private authService: AuthService,
    private location: Location,
    private fb: FormBuilder,
    private notificacion: NotificationsService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.titulo);   
  }

  enviar() {

    this.cargando = true;
    var json = this.dato.getRawValue();
    this.crudService.crear(json, this.URL).subscribe(
      resultado => {
        this.cargando = false;
        console.log(this.URL, " creado.");
        this.location.back();
      },
      error => {
        this.cargando = false;

        this.mensajeResponse.texto = "No especificado.";
        this.mensajeResponse.mostrar = true;
        this.mensajeResponse.clase = 'error';
        this.mensaje(3);

        try {
          let e = error.json();
          if (error.status == 401) {
            this.mensajeResponse.texto = "No tiene permiso para hacer esta operación.";

          }
          // Problema de validación
          if (error.status == 409) {
            this.mensajeResponse.texto = "Por favor verfique los campos marcados en rojo.";
            this.mensajeResponse.clase = 'warning';
            this.mensaje(8);
            for (var input in e.error) {
              // Iteramos todos los errores
              for (var i in e.error[input]) {
                this.mensajeResponse.titulo = input;
                this.mensajeResponse.texto = e.error[input][i];
                this.mensajeResponse.clase = "error";
                this.mensaje(3);
              }
            }
          }
        } catch (e) {

          if (error.status == 500) {
            this.mensajeResponse.texto = "500 (Error interno del servidor)";
          } else {
            this.mensajeResponse.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
          }
        }
      }
    );
  }
  private catalogo: any[] = [];
  cargarCatalogo(item: string, url: string) {
    this.crudService.lista(0, 0, url).subscribe(
      resultado => {
        this[item] = resultado;
        if (resultado.length == 0) {
          this.mensajeResponse.titulo = item;
          this.mensajeResponse.texto = `Esta vacio, póngase en contacto con un administrador.`;
          this.mensajeResponse.mostrar = true;
          this.mensajeResponse.clase = 'warning';
          this.mensaje(3);
        }
      },
      error => {
        this.mensajeResponse.texto = "No especificado.";
        this.mensajeResponse.mostrar = true;
        this.mensajeResponse.clase = 'error';
        this.mensaje(3);
        try {

          let e = error.json();

          if (error.status == 401) {
            this.mensajeResponse.texto = "No tiene permiso para ver los roles.";
          }

          if (error.status == 500) {

            this.mensajeResponse.texto = "500 (Error interno del servidor). No se pudieron cargar los roles";
          }
          this.mensajeResponse.clase = 'error';
          this.mensaje(3);
        } catch (e) {

          if (error.status == 500) {

            this.mensajeResponse.texto = "500 (Error interno del servidor). No se pudieron cargar los roles";
          } else {
            this.mensajeResponse.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.  No se pudieron cargar los roles";
          }
          this.mensajeResponse.clase = 'error';
          this.mensaje(3);
        }

      }
    );
  }

  regresar() {

    this.location.back();
  }


  //mostrar notificaciones
  public options = {
    position: ["bottom", "left"],
    timeOut: 2000,
    lastOnBottom: true
  };
  mensaje(cuentaAtras: number = 6, posicion: any[] = ["bottom", "left"]): void {
    var objeto = {
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: this.mensajeResponse.texto.length
    };

    this.options = {
      position: posicion,
      timeOut: cuentaAtras * 1000,
      lastOnBottom: true
    };
    if (this.mensajeResponse.titulo == '')
      this.mensajeResponse.titulo = this.URL;

    if (this.mensajeResponse.clase == 'alert')
      this.notificacion.alert(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

    if (this.mensajeResponse.clase == 'success')
      this.notificacion.success(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

    if (this.mensajeResponse.clase == 'info')
      this.notificacion.info(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

    if (this.mensajeResponse.clase == 'warning' || this.mensajeResponse.clase == 'warn')
      this.notificacion.warn(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

    if (this.mensajeResponse.clase == 'error' || this.mensajeResponse.clase == 'danger')
      this.notificacion.error(this.mensajeResponse.titulo, this.mensajeResponse.texto, objeto);

  }
}




