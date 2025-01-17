// consulta-ganancia.component.ts
import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../services/purchase.service';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'chartjs-adapter-date-fns';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-consulta-ganancia',
  templateUrl: './consulta-ganancia.component.html',
})
export class ConsultaGananciaComponent implements OnInit {
  results: any[] = [];
  summaryData: any[] = [];
  errorMessage: string = '';
  sortAscending: boolean = true;
  sortSymbolAscending: boolean = true;
  chart: any;

  constructor(private purchaseService: PurchaseService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.fetchPurchases();
  }

  // Cargar todas las compras desde el backend y calcular ganancias/pérdidas
  fetchPurchases() {
    this.purchaseService.getProfitLoss().subscribe({
      next: (response) => {
        this.results = response.map((purchase: any) => {
          const currentPrice = purchase.currentPrice;
          const gainLossPercentage =
            ((currentPrice - purchase.purchasePrice) / purchase.purchasePrice) * 100;
          const gainLossDollars = (currentPrice - purchase.purchasePrice) * purchase.quantity;

          const formattedDate = this.formatDate(purchase.purchaseDate);

          return {
            ...purchase,
            purchaseDate: formattedDate,
            gainLossPercentage,
            gainLossDollars,
          };
        });
        this.generateSummary();
        this.createChart();
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los datos de las compras.';
        console.error(error);
      },
    });
  }

  // Formatear fecha al formato `aaaa-mm-dd`
  formatDate(dateString: string): string {
    if (!dateString) return 'Fecha inválida';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Fecha inválida' : date.toISOString().split('T')[0];
  }

  // Generar el resumen agrupado por símbolo y fecha
  generateSummary() {
    const grouped = this.results.reduce((acc, curr) => {
      const key = `${curr.symbol}-${curr.purchaseDate}`;
      if (!acc[key]) {
        acc[key] = {
          symbol: curr.symbol,
          purchaseDate: curr.purchaseDate,
          totalQuantity: 0,
          totalValue: 0,
          gainLossDollars: 0,
        };
      }
      acc[key].totalQuantity += curr.quantity;
      acc[key].totalValue += curr.purchasePrice * curr.quantity;
      acc[key].gainLossDollars += curr.gainLossDollars;
      return acc;
    }, {});

    this.summaryData = Object.values(grouped).map((item: any) => {
      const costPrice = item.totalValue / item.totalQuantity;
      const gainLossPercentage = (item.gainLossDollars / item.totalValue) * 100;

      return {
        ...item,
        costPrice,
        gainLossPercentage,
      };
    });

    // Ordenar por fecha y luego por símbolo
    this.summaryData.sort((a, b) => {
      const dateComparison = new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return a.symbol.localeCompare(b.symbol);
    });
  }

  // Crear el gráfico de dispersión
  // Crear el gráfico de dispersión
createChart() {
  const data = this.summaryData.map((item) => ({
    x: item.purchaseDate, // Fecha formateada
    y: item.gainLossDollars, // Ganancia/Pérdida en dólares
    label: item.symbol, // Nombre de la acción
  }));

  if (this.chart) {
    this.chart.destroy();
  }

  this.chart = new Chart('summaryChart', {
    type: 'line', // Gráfico de línea
    data: {
      labels: this.summaryData.map((item) => item.purchaseDate), // Fechas relevantes
      datasets: [
        {
          label: 'Ganancia/Pérdida ($)',
          data: data,
          backgroundColor: 'rgba(0, 255, 0, 0.1)', // Relleno verde bajito
          borderColor: '#000000', // Color de la línea
          borderWidth: 2, // Grosor de la línea
          pointBackgroundColor: data.map((value) => (value.y > 0 ? '#00ff00' : '#ff0000')), // Color de los puntos
          pointRadius: 6, // Tamaño de los puntos
          tension: 0.2, // Suavizar las líneas
          fill: true, // Activar el relleno
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const dataPoint = data[context.dataIndex];
              return [
                `Acción: ${dataPoint.label}`,
                `Fecha: ${dataPoint.x}`,
                `Ganancia/Pérdida: $${dataPoint.y.toFixed(2)}`,
              ];
            },
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          type: 'category', // Fechas como categorías
          title: {
            display: true,
            text: 'Fecha',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Ganancia/Pérdida ($)',
          },
        },
      },
    },
  });
}

  // Exportar a Excel
  exportToExcel() {
    const formattedData = this.summaryData.map((item) => ({
      Símbolo: item.symbol,
      Fecha: item.purchaseDate,
      CantidadTotal: item.totalQuantity,
      ValorTotal: `$${item.totalValue.toFixed(2)}`,
      PrecioCosto: `$${item.costPrice.toFixed(2)}`,
      GananciaPérdidaPorcentaje: `${item.gainLossPercentage.toFixed(2)}%`,
      GananciaPérdidaUSD: `$${item.gainLossDollars.toFixed(2)}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resumen');
    XLSX.writeFile(workbook, 'resumen_acciones.xlsx');
  }

  // Exportar a PDF
  exportToPDF() {
    const canvas = document.getElementById('summaryChart') as HTMLCanvasElement;
    const chartImage = canvas.toDataURL('image/png');

    const doc = new jsPDF();
    doc.text('Resumen de Acciones', 10, 10);
    (doc as any).autoTable({
      head: [['Símbolo', 'Fecha de Compra', 'Cantidad Total', 'Valor Total (USD)', 'Precio de Costo', '% Ganancia/Pérdida', 'Ganancia/Pérdida ($)']],
      body: this.summaryData.map((item) => [
        item.symbol,
        item.purchaseDate,
        item.totalQuantity,
        `$${item.totalValue.toFixed(2)}`,
        `$${item.costPrice.toFixed(2)}`,
        `${item.gainLossPercentage.toFixed(2)}%`,
        `$${item.gainLossDollars.toFixed(2)}`,
      ]),
    });

    // Agregar gráfico al PDF
    doc.addPage();
    doc.text('Gráfico de Ganancias/Pérdidas', 10, 10);
    doc.addImage(chartImage, 'PNG', 10, 20, 180, 100);

    doc.save('resumen_acciones.pdf');
  }
  sortByGainLoss() {
    this.sortAscending = !this.sortAscending;
    this.results.sort((a, b) =>
      this.sortAscending ? a.gainLossDollars - b.gainLossDollars : b.gainLossDollars - a.gainLossDollars
    );
  }

  sortBySymbol() {
    this.sortSymbolAscending = !this.sortSymbolAscending;
    this.results.sort((a, b) =>
      this.sortSymbolAscending ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol)
    );
  }
}