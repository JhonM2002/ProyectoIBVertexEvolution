import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaGananciaComponent } from './consulta-ganancia.component';

describe('ConsultaGananciaComponent', () => {
  let component: ConsultaGananciaComponent;
  let fixture: ComponentFixture<ConsultaGananciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultaGananciaComponent]
    });
    fixture = TestBed.createComponent(ConsultaGananciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
