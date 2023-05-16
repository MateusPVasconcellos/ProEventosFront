import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/internal/operators/take';
import { Lote } from '../models/Lote';

@Injectable()
export class LoteService {

  baseUrl = "https://localhost:5001/api/Lotes";

  constructor(private http: HttpClient) { }

  public getLotesByEventoId(eventoId: number): Observable<Lote[]> {
    return this.http.get<Lote[]>(`${this.baseUrl}/${eventoId}`).pipe(take(1));
  }

  public saveLote(eventoId: number, lotes: Lote[]): Observable<Lote[]> {
    return this.http.put<Lote[]>(`${this.baseUrl}/${eventoId}`, lotes).pipe(take(1));;
  }

  public deleteLote(loteId: number, eventoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${loteId}/${eventoId}`).pipe(take(1));;
  }
}
