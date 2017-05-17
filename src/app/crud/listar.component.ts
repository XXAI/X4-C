import { Observable } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth.service';
import { CrudService } from './crud.service';

import { Mensaje } from '../mensaje';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'listar',
    template: '<simple-notifications [options]="options"></simple-notifications>'
})

export class ListarComponent implements OnInit {

    cargando: boolean = false;

    // # SECCION: Esta sección es para mostrar mensajes

    ultimaPeticion: any;
    // # FIN SECCION

    // # SECCION: Lista de dato

    //dato es el modelo general que contiene los datos del formulario
    dato: any[] = [];
    respuesta: any[] = [];
    mensajeResponse: Mensaje = new Mensaje(true);

    private paginaActual = 1;
    private resultadosPorPagina = 20;
    private total = 0;
    private paginasTotales = 0;
    private indicePaginas: number[] = []
    // # FIN SECCION

    // # SECCION: Resultados de búsqueda
    private ultimoTerminoBuscado = "";
    private terminosBusqueda = new Subject<string>();
    private resultadosBusqueda: any[] = [];
    private busquedaActivada: boolean = false;
    private paginaActualBusqueda = 1;
    private resultadosPorPaginaBusqueda = 20;
    private totalBusqueda = 0;
    private paginasTotalesBusqueda = 0;
    private indicePaginasBusqueda: number[] = []
    // # FIN SECCION

    @Input() URL: string;
    @Input() titulo: string;
    constructor(private title: Title, private crudService: CrudService, private authService: AuthService, private notificacion: NotificationsService) {

    }
    ngOnInit() {

        //this.title.setTitle("anys / Panel de control");
        this.listar(1);

        this.title.setTitle(this.titulo);
        var self = this;

        var busquedaSubject = this.terminosBusqueda
            .debounceTime(300) // Esperamos 300 ms pausando eventos
            .distinctUntilChanged() // Ignorar si la busqueda es la misma que la ultima
            .switchMap((term: string) => {
                
                this.busquedaActivada = term != "" ? true : false;

                this.ultimoTerminoBuscado = term;
                this.paginaActualBusqueda = 1;
                this.cargando = true;
                return term ? this.crudService.buscar(term, this.paginaActualBusqueda, this.resultadosPorPaginaBusqueda, this.URL) : Observable.of<any>({ data: [] })
            }


            ).catch(function handleError(error) {

                self.cargando = false;
                self.mensajeResponse.mostrar = true;
                self.ultimaPeticion = function () { self.listarBusqueda(self.ultimoTerminoBuscado, self.paginaActualBusqueda); };//OJO
                try {
                    let e = error.json();
                    if (error.status == 401) {
                        self.mensajeResponse.texto = "No tiene permiso para hacer esta operación.";
                        self.mensajeResponse.clase = "danger";
                        this.mensaje(2);
                    }
                } catch (e) {
                    console.log("No se puede interpretar el error");

                    if (error.status == 500) {
                        self.mensajeResponse.texto = "500 (Error interno del servidor)";
                    } else {
                        self.mensajeResponse.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
                    }
                    self.mensajeResponse.clase = "danger";
                    this.mensaje(2);
                }
                // Devolvemos el subject porque si no se detiene el funcionamiento del stream 
                return busquedaSubject

            })

        busquedaSubject.subscribe(
            resultado => {
                this.cargando = false;
                this.resultadosBusqueda = resultado.data as any[];
                this.totalBusqueda = resultado.total | 0;
                this.paginasTotalesBusqueda = Math.ceil(this.totalBusqueda / this.resultadosPorPaginaBusqueda);

                this.indicePaginasBusqueda = [];
                for (let i = 0; i < this.paginasTotalesBusqueda; i++) {
                    this.indicePaginasBusqueda.push(i + 1);
                }
            }

        );
    }

    buscar(term: string): void {
        this.terminosBusqueda.next(term);
    }

    listarBusqueda(term: string, pagina: number): void {
        this.paginaActualBusqueda = pagina;

        this.cargando = true;
        this.crudService.buscar(term, pagina, this.resultadosPorPaginaBusqueda, this.URL).subscribe(
            resultado => {
                this.cargando = false;

                this.resultadosBusqueda = resultado.data as any[];

                this.totalBusqueda = resultado.total | 0;
                this.paginasTotalesBusqueda = Math.ceil(this.totalBusqueda / this.resultadosPorPaginaBusqueda);

                this.indicePaginasBusqueda = [];
                for (let i = 0; i < this.paginasTotalesBusqueda; i++) {
                    this.indicePaginasBusqueda.push(i + 1);
                }
            },
            error => {
                this.cargando = false;
                this.mensajeResponse.mostrar = true;
                this.ultimaPeticion = function () { this.listarBusqueda(term, pagina); };
                try {
                    let e = error.json();
                    if (error.status == 401) {
                        this.mensajeResponse.texto = "No tiene permiso para hacer esta operación.";
                        this.mensajeResponse.clase = "danger";
                        this.mensaje(2);
                    }
                } catch (e) {
                    if (error.status == 500) {
                        this.mensajeResponse.texto = "500 (Error interno del servidor)";
                    } else {
                        this.mensajeResponse.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
                    }
                    this.mensajeResponse.clase = "danger";
                    this.mensaje(2);
                }

            }
        );
    }


    listar(pagina: number): void {
        this.paginaActual = pagina;

        this.cargando = true;
        this.crudService.lista(pagina, this.resultadosPorPagina, this.URL).subscribe(
            resultado => {
                this.cargando = false;
                this.dato = resultado.data as any[];

                this.total = resultado.total | 0;
                this.paginasTotales = Math.ceil(this.total / this.resultadosPorPagina);

                this.indicePaginas = [];
                for (let i = 0; i < this.paginasTotales; i++) {
                    this.indicePaginas.push(i + 1);
                }
                this.mensajeResponse.mostrar = true;
                this.mensajeResponse.texto = "lista cargada";
                this.mensajeResponse.clase = "success";
                this.mensaje(2);
            },
            error => {
                this.cargando = false;
                this.mensajeResponse.mostrar = true;
                this.ultimaPeticion = this.listar;
                try {
                    let e = error.json();
                    if (error.status == 401) {
                        this.mensajeResponse.texto = "No tiene permiso para hacer esta operación.";
                        this.mensajeResponse.clase = "danger";
                        this.mensaje(2);
                    }
                } catch (e) {
                    if (error.status == 500) {
                        this.mensajeResponse.texto = "500 (Error interno del servidor)";
                    } else {
                        this.mensajeResponse.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
                    }
                    this.mensajeResponse.clase = "danger";
                    this.mensaje(2);
                }

            }
        );
    }
    eliminar(item: any, index): void {
        item.cargando = true;
        this.crudService.eliminar(item.id, this.URL).subscribe(
            data => {
                item.cargando = false;
                this.dato.splice(index, 1);

                this.mensajeResponse.mostrar = true;
                this.mensajeResponse.texto = "Se eliminó el elemento de la lista.";
                this.mensajeResponse.clase = "success";
                this.mensaje(2);
            },
            error => {
                item.cargando = false;
                this.mensajeResponse.mostrar = true;
                this.ultimaPeticion = function () {
                    this.eliminar(item, index);
                }


                try {
                    let e = error.json();
                    if (error.status == 401) {
                        this.mensajeResponse.texto = "No tiene permiso para hacer esta operación.";
                        this.mensajeResponse.clase = "danger";
                        this.mensaje(2);
                    }
                } catch (e) {
                    if (error.status == 500) {
                        this.mensajeResponse.texto = "500 (Error interno del servidor)";
                    } else {
                        this.mensajeResponse.texto = "No se puede interpretar el error. Por favor contacte con soporte técnico si esto vuelve a ocurrir.";
                    }
                    this.mensajeResponse.clase = "danger";
                    this.mensaje(2);
                }

            }
        );
    }

    // # SECCION: Paginación
    paginaSiguiente(): void {
        this.listar(this.paginaActual + 1);
    }
    paginaAnterior(): void {
        this.listar(this.paginaActual - 1);
    }

    paginaSiguienteBusqueda(term: string): void {
        this.listarBusqueda(term, this.paginaActualBusqueda + 1);
    }
    paginaAnteriorBusqueda(term: string): void {
        this.listarBusqueda(term, this.paginaActualBusqueda - 1);
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
