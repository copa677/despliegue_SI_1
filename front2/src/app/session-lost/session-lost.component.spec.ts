import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionLostComponent } from './session-lost.component';

describe('SessionLostComponent', () => {
  let component: SessionLostComponent;
  let fixture: ComponentFixture<SessionLostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SessionLostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionLostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
