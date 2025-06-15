import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteActividadComponent } from './reporte-actividad.component';

describe('ReporteActividadComponent', () => {
  let component: ReporteActividadComponent;
  let fixture: ComponentFixture<ReporteActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteActividadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
