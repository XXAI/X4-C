import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaComponent } from './lista/lista.component';
import { VerComponent } from './ver/ver.component';
import { NuevoComponent } from './nuevo/nuevo.component';


import { AuthGuard } from '../auth-guard.service';
import { PermisosGuard } from '../permisos.guard';

const routes: Routes = [
	{
    path: 'admision',
    children: [
       { path: '', component: VerComponent},
       { path: 'nuevo', component: NuevoComponent }/*,
       { path: 'editar/:id', component: EditarComponent, canActivate: [PermisosGuard], data: { key: 'dlV1H4gX0nqEgHauHC8BRIlwl6SGUoUt'}},*/
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmisionRoutingModule { }
