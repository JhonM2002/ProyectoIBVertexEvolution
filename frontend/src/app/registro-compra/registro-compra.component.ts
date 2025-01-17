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

  quantityError = false;
  priceError = false;
  dateError = false;

  constructor(private purchaseService: PurchaseService) {}

  onSubmit() {
    if (this.quantityError || this.priceError) {
      // Si hay un error, no permitas continuar
      alert('Corrige los errores antes de continuar.');
      return;
    }
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

  // Validación de cantidad
  validateQuantity(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const quantity = Number(input);

    // Valida si el número es entero
    if (!Number.isInteger(quantity) || quantity <= 0) {
      this.quantityError = true;
    } else {
      this.quantityError = false;
    }
  }

  // Validación de precio
  validatePrice(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const price = Number(input);

    // Valida si el valor es un número positivo
    if (isNaN(price) || price <= 0) {
      this.priceError = true;
    } else {
      this.priceError = false;
    }
  }

  validateDate(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const selectedDate = new Date(input);
    const today = new Date();

    // Establece la hora de hoy a las 00:00:00 para comparar solo la fecha
    today.setHours(0, 0, 0, 0);

    // Valida si la fecha es anterior a hoy
    this.dateError = selectedDate >= today;
  }

}
