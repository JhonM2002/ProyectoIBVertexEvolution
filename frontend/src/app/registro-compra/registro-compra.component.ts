import { Component } from '@angular/core';
import { PurchaseService } from '../services/purchase.service';

@Component({
  selector: 'app-registro-compra',
  templateUrl: './registro-compra.component.html',
})
export class RegistroCompraComponent {
  purchase = {
    symbol: '' as string,
    quantity: null as number | null,
    purchasePrice: null as number | null,
    purchaseDate: '' as string,
  };

  constructor(private purchaseService: PurchaseService) {}

  onSubmit() {
    this.purchaseService.createPurchase(this.purchase).subscribe({
      next: (response) => {
        alert('Compra registrada con éxito!');
        this.purchase = { symbol: '', quantity: null, purchasePrice: null, purchaseDate: '' };
      },
      error: (error) => {
        alert('Error al registrar la compra.');
        console.error(error);
      },
    });
  }
}
