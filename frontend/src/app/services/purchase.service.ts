import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apiUrl = 'http://localhost:5000/api/purchases';

  constructor(private http: HttpClient) {}

  // Registrar una compra
  createPurchase(purchase: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, purchase);
  }

  // Consultar ganancia/pérdida
  getProfitLoss(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profit-loss`);
  }

  // Comparar precio de una acción
  compareStockPrice(symbol: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/compare/${symbol}`);
  }
  getPurchases() {
    return this.http.get<any[]>(this.apiUrl);
  }
  
}
