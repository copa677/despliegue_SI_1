import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProveedorComponent } from './add-new-proveedor.component';

describe('AddNewProveedorComponent', () => {
  let component: AddNewProveedorComponent;
  let fixture: ComponentFixture<AddNewProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewProveedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
