import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.css']
})
export class HubComponent implements OnInit {

  mostrar: boolean = false;
  
  // Se debe indicar los permisos para que el usuario tenga al menos uno para mostrar el item

  private itemsProtegidos = [
    
    /*{ 
      title:'Almacén', routerLink:'/almacen', icono:'assets/hub-farmacia.svg',
      permisos: [
        'z9MQHY1YAIlYWsPLPF9OZYN94HKjOuDk', // Ver pedidos
        'iSxK0TpoYpnzf8KIQTWOq9Web7WnSKhz' // Ver entregas
      ] 
    },*/
    { 
      title:'Pacientes', routerLink:'/paciente', icono:'assets/avatar-enfermero.svg',
      permisos: [
        'Zz02R1xvYQBSBx35Bs45F7komHUnvBet', // Ver admision
      ] 
    },
    { 
      title:'Panel de control', routerLink:'/panel-control', icono:'assets/hub-panel-control.svg', 
      permisos: [
        'mGKikN0aJaeF2XrHwwYK3XNw0f9CSZDe', // Ver usuarios
        'ICmOKw3HxhgRna4a78OP0QmKrIX0bNsp', // Ver roles
        'DYwQAxJbpHWw07zT09scEogUeFKFdGSu' // Ver permisos

      ] 
    }
  ]
  
  hubAutorizado = [ { title:'Dashboard', routerLink:'/dashboard', icono:'assets/hub-dashboard.svg' } ]

  constructor() { }

  ngOnInit() {
    let usuario = JSON.parse(localStorage.getItem("usuario"));
    var permisos =  usuario.permisos.split("|")

    if(permisos.length > 0){      
        
      for(var i in this.itemsProtegidos){
        siguienteItemProtegido:     
        for(var j in this.itemsProtegidos[i].permisos){
          for(var k in permisos){
            if(permisos[k] == this.itemsProtegidos[i].permisos[j]){
              this.hubAutorizado.push(this.itemsProtegidos[i]);              
              break siguienteItemProtegido;
            }           
          }
        }
      }
      
    }
  }

  toggle() {
    this.mostrar = !this.mostrar;
  }

}
