// import { Component, OnInit } from '@angular/core';
// import { PurchaseService } from '../services/purchase.service';

// @Component({
//   selector: 'app-consulta-ganancia',
//   templateUrl: './consulta-ganancia.component.html',
// })
// export class ConsultaGananciaComponent implements OnInit {
//   results: any[] = [];
//   errorMessage: string = '';

//   constructor(private purchaseService: PurchaseService) {}

//   ngOnInit() {
//     this.fetchProfitLoss();
//   }

//   fetchProfitLoss() {
//     this.purchaseService.getProfitLoss().subscribe({
//       next: (response) => {
//         this.results = response;
//         this.errorMessage = '';
//       },
//       error: (error) => {
//         this.errorMessage = 'Error al obtener las ganancias/pérdidas.';
//         console.error(error);
//       },
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../services/purchase.service';

@Component({
  selector: 'app-consulta-ganancia',
  templateUrl: './consulta-ganancia.component.html',
})
export class ConsultaGananciaComponent implements OnInit {
  results: any[] = [];
  errorMessage: string = '';
  selectedStock: any = null;
  selectedSymbol: string = ''; 

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    this.fetchPurchases();
  }

  // Cargar todas las compras desde el backend
  fetchPurchases() {
    this.purchaseService.getProfitLoss().subscribe({
      next: (response) => {
        this.results = response;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los datos de las compras.';
        console.error(error);
      },
    });
  }

  // Comparar una acción específica
  // compareStock(stock: any) {
  //   this.purchaseService.compareStockPrice(stock.symbol).subscribe({
  //     next: (response) => {
  //       const currentPrice = response.currentPrice;
  //       const gainLossPercentage = ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
  //       const gainLossDollars = (currentPrice - stock.purchasePrice) * stock.quantity;

  //       this.selectedStock = {
  //         symbol: stock.symbol,
  //         purchasePrice: stock.purchasePrice,
  //         quantity: stock.quantity,
  //         currentPrice: currentPrice,
  //         gainLossPercentage: gainLossPercentage.toFixed(2),
  //         gainLossDollars: gainLossDollars.toFixed(2),
  //       };
  //     },
  //     error: (error) => {
  //       this.errorMessage = 'Error al comparar el precio de la acción.';
  //       console.error(error);
  //     },
  //   });
  // }
  compareStock(stock: any) {
    this.selectedSymbol = stock.symbol; 
    this.purchaseService.compareStockPrice(stock.symbol).subscribe({
      next: (response) => {
        const currentPrice = response.currentPrice;
        const gainLossPercentage = ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
        const gainLossDollars = (currentPrice - stock.purchasePrice) * stock.quantity;
  
        this.selectedStock = {
          symbol: stock.symbol,
          purchasePrice: stock.purchasePrice,
          quantity: stock.quantity,
          currentPrice: currentPrice,
          gainLossPercentage: gainLossPercentage.toFixed(2),  // Se mantiene como string para mostrar %
          gainLossDollars: gainLossDollars  // Aquí no usamos toFixed para mantenerlo como número
        };
      },
      error: (error) => {
        this.errorMessage = 'Error al comparar el precio de la acción.';
        console.error(error);
      },
    });
  }
}
