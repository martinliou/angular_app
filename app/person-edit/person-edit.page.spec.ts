import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonEditPage } from './person-edit.page';

describe('PersonEditPage', () => {
  let component: PersonEditPage;
  let fixture: ComponentFixture<PersonEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
