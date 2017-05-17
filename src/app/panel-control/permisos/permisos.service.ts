import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';


import { JwtRequestService } from '../../jwt-request.service';

@Injectable()
export class PermisosService {

  static readonly URL: string = "permisos";
  
  constructor(private http: Http,  private jwtRequest:JwtRequestService) { }

  lista(): Observable<any[]>{
    return this.jwtRequest.get(PermisosService.URL).map( (response: Response) => response.json().data) as Observable<any[]>;
  }
}
