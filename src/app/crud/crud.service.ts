import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { JwtRequestService } from '../jwt-request.service';

import { API_URL } from '../config';


@Injectable()
export class CrudService {

  constructor(private http: Http, private jwtRequest: JwtRequestService) { }

  buscar(term: string, pagina: number = 1, resultados_por_pagina: number = 20, URL: string): Observable<any> {
    return this.jwtRequest.get(URL, null, { q: term, page: pagina, per_page: resultados_por_pagina }).map((response: Response) => response.json().data);
  }

  lista(pagina: number = 1, resultados_por_pagina: number = 20, URL: string): Observable<any> {
    if (pagina > 0)
      return this.jwtRequest.get(URL, null, { page: pagina, per_page: resultados_por_pagina }).map((response: Response) => response.json().data);
    else
      return this.jwtRequest.get(URL, null).map((response: Response) => response.json().data);
  }

  ver(id: any, URL: string): Observable<any> {
    return this.jwtRequest.get(URL, id, {}).map((response: Response) => {

      let jsonData = response.json().data;
  
      var data = jsonData as any;
      return data;
    }) as Observable<any>;
  }

  crear(data: any[], URL: string): Observable<any> {
    return this.jwtRequest.post(URL, data).map((response: Response) => response.json().data) as Observable<any>;
  }

  editar(id: any, data: any[], URL: string): Observable<any> {
    return this.jwtRequest.put(URL, id, data).map((response: Response) => response.json().data) as Observable<any>;
  }

  eliminar(id: any, URL: string): Observable<any> {
    return this.jwtRequest.delete(URL, id).map((response: Response) => response.json().data) as Observable<any>;
  }

}