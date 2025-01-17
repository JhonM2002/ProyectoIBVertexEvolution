import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroCompraComponent } from './registro-compra/registro-compra.component';
import { ConsultaGananciaComponent } from './consulta-ganancia/consulta-ganancia.component';

const routes: Routes = [
  { path: 'registro', component: RegistroCompraComponent },
  { path: 'consulta', component: ConsultaGananciaComponent },
  { path: '', redirectTo: '/registro', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
