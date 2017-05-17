import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListarComponent } from './listar.component';
import { NuevosComponent } from './nuevos.component';
import { ModificarComponent } from './modificar.component';

import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
    imports: [
        CommonModule,
        SimpleNotificationsModule.forRoot()
    ],
    exports: [
        ListarComponent,
        NuevosComponent,
        ModificarComponent
    ],
    declarations: [
        ListarComponent,
        NuevosComponent,
        ModificarComponent
    ]
})
export class CrudModule { }
