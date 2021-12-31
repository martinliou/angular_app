import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainpagePage } from './mainpage.page';

describe('MainpagePage', () => {
  let component: MainpagePage;
  let fixture: ComponentFixture<MainpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
