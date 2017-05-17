import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { PerfilComponent } from './perfil.component';
import { CambiarEntornoService } from './cambiar-entorno.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
      PerfilComponent
  ],
  providers: [CambiarEntornoService],
  declarations: [PerfilComponent]

})
export class PerfilModule { }
