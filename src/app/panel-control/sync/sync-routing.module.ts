import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstatusComponent } from './estatus/estatus.component';
import { AuthGuard } from '../../auth-guard.service';
import { PermisosGuard } from '../../permisos.guard';

const routes: Routes = [
  { path: 'panel-control', redirectTo: '/panel-control/sync/estatus', pathMatch: 'full' },
  {
    path: 'panel-control/sync',
    children: [
       { path: '',  redirectTo: '/panel-control/sync/estatus', pathMatch: 'full' },
       { path: 'estatus', component: EstatusComponent },
       
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SyncRoutingModule { }
