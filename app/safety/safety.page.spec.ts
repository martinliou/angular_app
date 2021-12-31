import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyPage } from './safety.page';

describe('SafetyPage', () => {
  let component: SafetyPage;
  let fixture: ComponentFixture<SafetyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
