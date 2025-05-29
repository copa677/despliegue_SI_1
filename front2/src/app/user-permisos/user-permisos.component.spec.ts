import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermisosComponent } from './user-permisos.component';

describe('UserPermisosComponent', () => {
  let component: UserPermisosComponent;
  let fixture: ComponentFixture<UserPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPermisosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
