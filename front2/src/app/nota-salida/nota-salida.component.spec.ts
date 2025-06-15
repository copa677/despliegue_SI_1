import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaSalidaComponent } from './nota-salida.component';

describe('NotaSalidaComponent', () => {
  let component: NotaSalidaComponent;
  let fixture: ComponentFixture<NotaSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotaSalidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotaSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
