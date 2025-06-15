import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCompraComponent } from './reportes.component';

describe('ReportesComponent', () => {
  let component: ReporteCompraComponent;
  let fixture: ComponentFixture<ReporteCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteCompraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
