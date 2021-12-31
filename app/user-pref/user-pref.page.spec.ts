import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrefPage } from './user-pref.page';

describe('UserPrefPage', () => {
  let component: UserPrefPage;
  let fixture: ComponentFixture<UserPrefPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPrefPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPrefPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
