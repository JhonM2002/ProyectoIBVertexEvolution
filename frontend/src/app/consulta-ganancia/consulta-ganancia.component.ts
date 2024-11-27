import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../services/purchase.service';

@Component({
  selector: 'app-consulta-ganancia',
  templateUrl: './consulta-ganancia.component.html',
})
export class ConsultaGananciaComponent implements OnInit {
  results: any[] = [];
  errorMessage: string = '';

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.fetchProfitLoss();
  }

  fetchProfitLoss() {
    this.purchaseService.getProfitLoss().subscribe({
      next: (response) => {
        this.results = response;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener las ganancias/pérdidas.';
        console.error(error);
      },
    });
  }
}
