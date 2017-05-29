import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaComponent } from './lista/lista.component';
import { EgresoComponent } from './egreso/egreso.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { VerificacionComponent } from './verificacion/verificacion.component';

import { AuthGuard } from '../../auth-guard.service';
import { PermisosGuard } from '../../permisos.guard';


const routes: Routes = [
	{
	path: 'pacientes/modulo',
	    children: [
	       { path: 'egreso', component: ListaComponent},
	       { path: 'egreso/:id', component: EgresoComponent },
	       { path: 'ingreso/:id', component: IngresoComponent},
	       { path: 'verificacion', component: VerificacionComponent},
	    ],
	    canActivate: [AuthGuard]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EgresoRoutingModule { }
