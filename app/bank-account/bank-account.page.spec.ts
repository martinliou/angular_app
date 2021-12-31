import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountPage } from './bank-account.page';

describe('BankAccountPage', () => {
  let component: BankAccountPage;
  let fixture: ComponentFixture<BankAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
