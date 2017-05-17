import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import { Rol }       from '../../roles/rol';


@Component({
  selector: 'panel-control-usuarios-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor() { }

  @Input() roles: Rol[];
  @Input() unidadesMedicas: any[];
  @Input() usuario:FormGroup;

  @Input()  usuarioRepetido:boolean;
  @Input()  usuarioInvalido:boolean;
  @Input()  cargando: boolean;
  @Input()  cargandoRoles: boolean;
  @Input()  mostrarCambiarPassword:boolean;

  @Output() onEnviar = new EventEmitter<void>();
  @Output() onRegresar = new EventEmitter<void>();
  @Output() onToggleCambiarPassword = new EventEmitter<void>();
  @Output() onCargarRoles = new EventEmitter<void>();

  // # Esto es solo para listar las unidades medicas que ya estan relacionadas
  // al usuario, en el modulo de edicion
  @Input() unidadesMedicasEdicion = null;

  tab:number = 1;
  unidadesMedicasAgregadas: any[] = [];
  private cluesAgregadas: string[] = [];
  unidadMedicaSeleccionada = null;

  

  private idsAlmacenesSeleccionados: string[] = [];

  ngOnInit() {
    var ums:FormArray = this.usuario.get('unidades_medicas') as FormArray;
    var almacenes:FormArray = this.usuario.get('almacenes') as FormArray;
    

    this.cluesAgregadas = ums.value;
    
    this.idsAlmacenesSeleccionados = almacenes.value;
    
    if(this.unidadesMedicasEdicion != null){
    
      this.unidadesMedicasAgregadas = this.unidadesMedicasEdicion;

      for(var i in this.unidadesMedicasAgregadas){
        for(var j in this.unidadesMedicasAgregadas[i].almacenes){
          for(var z in this.idsAlmacenesSeleccionados){
            if(this.idsAlmacenesSeleccionados[z] == this.unidadesMedicasAgregadas[i].almacenes[j].id){
              this.unidadesMedicasAgregadas[i].almacenes[j].seleccionado = true;
              break;
            }
          }          
        }
      }
    }
  }
 
  enviar() {
    this.onEnviar.emit();
  }
  cargarRoles(){
     this.onCargarRoles.emit();
  }

  regresar() {
    this.onRegresar.emit();
  }

  toggleCambiarPassword() {
    this.onToggleCambiarPassword.emit();
  }

  agregarUnidadMedica(clues){
    

    for(var i in this.unidadesMedicas){
      if(this.unidadesMedicas[i].clues == clues){
        this.unidadesMedicasAgregadas.push(this.unidadesMedicas[i]);
        this.cluesAgregadas.push(clues);
        this.usuario.controls['unidades_medicas'].setValue(this.cluesAgregadas);
      }
    }
  }

  eliminarClues(event,item,index){
    event.preventDefault();
    event.stopPropagation();
  }

  toggleAlmacen(item){
    var bandera = false;
    for(var i = 0; i < this.idsAlmacenesSeleccionados.length; i++){
      if(this.idsAlmacenesSeleccionados[i]== item.id){        
        this.idsAlmacenesSeleccionados.splice(i,1);
        item.seleccionado = false;
        bandera = true;
        break;
      }
    }
    if(!bandera) {      
      this.idsAlmacenesSeleccionados.push(item.id)
      item.seleccionado = true;
    }

    this.usuario.controls['almacenes'].setValue(this.idsAlmacenesSeleccionados);
    
  }

  
  

  
}
