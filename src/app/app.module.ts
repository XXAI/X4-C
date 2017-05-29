import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';


import { AuthGuard } from './auth-guard.service';
import { PermisosGuard } from './permisos.guard';
import { AuthService } from './auth.service';
import { JwtRequestService } from './jwt-request.service';
import { JwtHelper } from 'angular2-jwt';

import { AppRoutingModule }             from './app-routing.module';
import { WildcardRoutingModule } from './wildcard-routing.module';
import { HubModule } from './hub/hub.module';
import { PerfilModule } from './perfil/perfil.module';
import { BloquearPantallaModule } from './bloquear-pantalla/bloquear-pantalla.module';
import { PipesModule }             from './pipes/pipes.module';

// # Admisión
import { EgresoModule } from './admision/egreso/egreso.module';
import { PacienteModule } from './admision/paciente/paciente.module';


// # Hub Panel de control
import { UsuariosModule } from './panel-control/usuarios/usuarios.module';
import { RolesModule } from './panel-control/roles/roles.module';
import { SyncModule } from './panel-control/sync/sync.module';



import { CrudModule } from './crud/crud.module';




// Asegurarase que en imports "WildcardRoutingModule" vaya al ÚLTIMO
// Esto nos sirve para redireccionar a una página 404 en lugar de que se genere un error

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HubModule,
    PerfilModule,
    BloquearPantallaModule,
    PipesModule,
    SyncModule,
    RolesModule,
    UsuariosModule,
    PacienteModule,
    EgresoModule,
    CrudModule,
    WildcardRoutingModule, // Este siempre debe ir al final para que no haga conflicto con otras rutas
    
  ],
  providers: [ Title, AuthGuard, PermisosGuard, AuthService,JwtHelper, JwtRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }

