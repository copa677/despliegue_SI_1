import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAlmacenComponent } from './add-new-almacen.component';

describe('AddNewAlmacenComponent', () => {
  let component: AddNewAlmacenComponent;
  let fixture: ComponentFixture<AddNewAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewAlmacenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
