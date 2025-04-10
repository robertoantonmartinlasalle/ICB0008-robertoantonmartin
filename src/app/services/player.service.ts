// Servicio para obtener jugadores desde la API externa balldontlie.io

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// URL base de la API externa (usa /v1 sin /api)
const API_URL = 'https://api.balldontlie.io/v1/players';

// Mi API KEY personal, la incluyo en los headers de las peticiones
const API_KEY = 'c9ce85f1-4034-461b-8487-d7d6bbf7ab1e';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  constructor(private http: HttpClient) {}

  /*
    Obtengo una lista de jugadores desde la API externa.
    Uso paginación con cursor y defino el número de resultados por página.
  */
  getPlayers(cursor: string = ''): Observable<any> {
    let params = new HttpParams().set('per_page', 20);

    if (cursor) {
      params = params.set('cursor', cursor);
    }

    const headers = new HttpHeaders().set('Authorization', API_KEY);

    return this.http.get(API_URL, { params, headers });
  }

  /*
    Devuelvo un jugador específico por su ID.
    También envío el API KEY por cabecera.
  */
  getPlayerById(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', API_KEY);
    return this.http.get(`${API_URL}/${id}`, { headers });
  }
}
