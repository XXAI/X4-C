import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaComponent } from './lista/lista.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { EditarComponent } from './editar/editar.component';
import { HistorialComponent } from './historial/historial.component';

import { AuthGuard } from '../../auth-guard.service';
import { PermisosGuard } from '../../permisos.guard';

const routes: Routes = 
[
	{
	    path: 'paciente',
	    children: [
	       { path: '', component: ListaComponent},
	       { path: 'nuevo', component: NuevoComponent },
	       { path: 'editar/:id', component: EditarComponent},
	       { path: 'historial/:id', component: HistorialComponent},
	    ],
	    canActivate: [AuthGuard]
  	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
