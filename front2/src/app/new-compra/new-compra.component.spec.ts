import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCompraComponent } from './new-compra.component';

describe('NewCompraComponent', () => {
  let component: NewCompraComponent;
  let fixture: ComponentFixture<NewCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewCompraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
