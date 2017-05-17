import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdmisionRoutingModule } from './admision-routing.module';
import { PaginacionModule } from '../paginacion/paginacion.module';

import { ListaComponent } from './lista/lista.component';

import { AuthService } from '../auth.service';
import { VerComponent } from './ver/ver.component';
import { MenuModule } from './menu/menu.module';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { NuevoComponent } from './nuevo/nuevo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdmisionRoutingModule,
    PaginacionModule,
    MenuModule
  ],
  declarations: [ListaComponent, VerComponent, MenuLateralComponent, NuevoComponent],
  providers: [ AuthService],
})
export class AdmisionModule { }
