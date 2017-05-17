import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscarModuloPipe } from './buscar-modulo.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[
    BuscarModuloPipe
  ],
  declarations: [BuscarModuloPipe]
})
export class PipesModule { }
