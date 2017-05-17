import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermisosService  } from './permisos.service';
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PermisosService]
})
export class PermisosRoutingModule { }
