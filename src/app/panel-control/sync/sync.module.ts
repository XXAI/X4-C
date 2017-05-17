import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterStateSnapshot } from '@angular/router';

import { MenuModule } from '../menu/menu.module';

import { SyncRoutingModule } from './sync-routing.module';
import { EstatusComponent } from './estatus/estatus.component';

@NgModule({
  imports: [
    CommonModule,
    SyncRoutingModule,   
    MenuModule
  ],
  declarations: [ EstatusComponent]
})
export class SyncModule { }
