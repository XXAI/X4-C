import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { CrudService } from './crud.service';

import { Mensaje } from '../mensaje';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'modificar',
    template: '<simple-notifications [options]="options"></simple-notifications>'
})
export class ModificarComponent implements OnInit {
    private id: string;
    private usuarioRepetido: boolean = false;
    private usuarioInvalido: boolean = false;
    private cambiarPassword: boolean = false;

    private datosCargados: boolean;
    private cargando: boolean = false;
    private cargandoRoles: boolean = false;
    // private roles: Rol[] = [];

    // # SECCION: Esta sección es para mostrar mensajes
    mensajeResponse: Mensaje = new Mensaje()

    // # FIN SECCION

    @Input() URL: string;
    @Input() titulo: string;
    @Input() dato: FormGroup;
    constructor(
        private router: Router,
        private title: Title,
        private authService: AuthService,
        private route: ActivatedRoute,
        private location: Location,
        private crudService: CrudService,
        private fb: FormBuilder,
        private notificacion: NotificationsService
    ) { }

    ngOnInit() {
        this.title.setTitle(this.titulo);

        this.route.params.subscribe(params => {
            this.id = params['id']; // Se puede agregar un simbolo + antes de la variable params para volverlo number
            this.cargarDatos();
        });
    }


    toggleCambiarPassword() {
        this.cambiarPassword = !this.cambiarPassword

        if (this.cambiarPassword) {
            this.dato.get('password').enable();
            this.dato.get('confirmarPassword').enable();
        } else {
            this.dato.get('password').disable();
            this.dato.get('confirmarPassword').disable();
        }

    }
    enviar() {

        if (this.dato.get('password').value != this.dato.get('confirmarPassword').value) {
            return false;
        }
        this.cargando = true;
        let dato = this.dato.value;
        if (!this.cambiarPassword) {
            delete dato.cambiarPassword;
        }
        this.crudService.editar(this.id, this.dato.value, this.URL).subscribe(
            resultado => {
                this.cargando = false;
                console.log("Usuario editado.");

                this.mensajeResponse.texto = "Se han guardado los cambios.";
                this.mensajeResponse.mostrar = true;
                this.mensajeResponse.clase = "success";
                this.mensaje(2);
            },
            error => {
                this.cargando = false;

                this.mensajeResponse.texto = "No especificado.";
                this.mensajeResponse.mostrar = true;
                this.mensajeResponse.clase = "alert";
                this.mensaje(2);
                try {
                    let e = error.json();
                    if (error.status == 401) {
                        this.mensajeResponse.texto = "No tiene permiso para hacer esta operación.";
                        this.mensajeResponse.clase = "error";
                        this.mensaje(2);
                    }
                    // Problema de validación
                    if (error.status == 409) {
                        this.mensajeResponse.texto = "Por favor verfique los campos marcados en rojo.";
                        this.mensajeResponse.clase = "error";
                        this.mensaje(8);
                        this.usuarioRepetido = false;
                        this.usuarioInvalido = false;
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
                    this.mensajeResponse.clase = "error";
                    this.mensaje(2);
                }

            }
        );
    }

    cargarDatos() {
        this.cargando = true;
        console.log("Cargando ", this.URL);
        this.crudService.ver(this.id, this.URL).subscribe(
            resultado => {
                this.cargando = false;
                this.datosCargados = true;
                this.dato.patchValue(resultado);

                this.mensajeResponse.titulo = "Modificar";
                this.mensajeResponse.texto = "Los datos se cargaron";
                this.mensajeResponse.clase = "success";
                this.mensaje(2);
            },
            error => {
                this.cargando = false;

                this.mensajeResponse = new Mensaje(true);
                this.mensajeResponse = new Mensaje(true);
                this.mensajeResponse.mostrar;

                try {
                    let e = error.json();
                    if (error.status == 401) {
                        this.mensajeResponse.texto = "No tiene permiso para hacer esta operación.";
                        this.mensajeResponse.clase = "success";
                        this.mensaje(2);
                    }

                } catch (e) {

                    if (error.status == 500) {
                        this.mensajeResponse.texto = "500 (Error interno del servidor)";
                    } else {
                        this.mensajeResponse.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
                    }
                    this.mensajeResponse.clase = "error";
                    this.mensaje(2);
                }


            }
        );
    }
    private catalogo: any[] = []; roles: any[]=[];
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
                this.mensajeResponse = new Mensaje(true);
                this.mensajeResponse.texto = "No especificado.";
                this.mensajeResponse.mostrar = true;

                try {

                    let e = error.json();

                    if (error.status == 401) {
                        this.mensajeResponse.texto = "No tiene permiso para ver los roles.";
                    }

                    if (error.status == 500) {

                        this.mensajeResponse.texto = "500 (Error interno del servidor). No se pudieron cargar los roles";
                    }
                } catch (e) {

                    if (error.status == 500) {

                        this.mensajeResponse.texto = "500 (Error interno del servidor). No se pudieron cargar los roles";
                    } else {
                        this.mensajeResponse.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.  No se pudieron cargar los roles";
                    }
                }

            }
        );
    }
    /*
        cargarRoles() {
            this.cargandoRoles = true;
            this.rolesService.lista().subscribe(
                roles => {
                    this.cargandoRoles = false;
                    this.roles = roles;
                    console.log("Roles cargados.");
    
                    if (this.roles.length == 0) {
                        this.mensajeAdvertencia = new Mensaje(true);
                        this.mensajeAdvertencia.texto = `
                No hay roles registrados en el sistema, póngase en contacto con un administrador.`;
                        this.mensajeAdvertencia.mostrar = true;
                    }
    
                    this.cargarDatos();
                },
                error => {
                    this.cargandoRoles = false;
    
                    this.mensajeResponse = new Mensaje(true);
                    this.mensajeResponse.texto = "No especificado.";
                    this.mensajeResponse.mostrar = true;
    
                    this.cargarDatos();
    
                    try {
                        let e = error.json();
                        if (error.status == 401) {
                            this.mensajeResponse.texto = "No tiene permiso para ver los roles.";
                        }
    
                        if (error.status == 500) {
    
                            this.mensajeResponse.texto = "500 (Error interno del servidor). No se pudieron cargar los roles";
                        }
                    } catch (e) {
                        console.log("No se puede interpretar el error");
    
                        if (error.status == 500) {
    
                            this.mensajeResponse.texto = "500 (Error interno del servidor). No se pudieron cargar los roles";
                        } else {
                            this.mensajeResponse.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.  No se pudieron cargar los roles";
                        }
                    }
    
    
                }
            );
        }
    */
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
