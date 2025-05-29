import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletaCompraComponent } from './boleta-compra.component';

describe('BoletaCompraComponent', () => {
  let component: BoletaCompraComponent;
  let fixture: ComponentFixture<BoletaCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoletaCompraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoletaCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
