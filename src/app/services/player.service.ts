// Servicio para obtener jugadores desde la API externa balldontlie.io
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// URL base de la API externa (usa /v1 sin /api)
const API_URL = 'https://api.balldontlie.io/v1/players';

// Tu API KEY personal (usada en los headers)
const API_KEY = 'c9ce85f1-4034-461b-8487-d7d6bbf7ab1e';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene jugadores con paginación usando cursor
   * @param cursor (opcional) cursor para obtener la siguiente página
   */
  getPlayers(cursor: string = ''): Observable<any> {
    let params = new HttpParams().set('per_page', 20); // Máximo 100 si quieres más

    // Si se proporciona cursor, lo añadimos
    if (cursor) {
      params = params.set('cursor', cursor);
    }

    const headers = new HttpHeaders().set('Authorization', API_KEY);

    return this.http.get(API_URL, { params, headers });
  }

  getPlayerById(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', API_KEY);
    return this.http.get(`${API_URL}/${id}`, { headers });
  }
}
