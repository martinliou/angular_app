import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneChangePage } from './phone-change.page';

describe('PhoneChangePage', () => {
  let component: PhoneChangePage;
  let fixture: ComponentFixture<PhoneChangePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneChangePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneChangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
