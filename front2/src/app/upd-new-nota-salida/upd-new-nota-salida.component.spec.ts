import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdNewNotaSalidaComponent } from './upd-new-nota-salida.component';

describe('UpdNewNotaSalidaComponent', () => {
  let component: UpdNewNotaSalidaComponent;
  let fixture: ComponentFixture<UpdNewNotaSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdNewNotaSalidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdNewNotaSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
