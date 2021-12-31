import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountAddNextPage } from './bank-account-add-next.page';

describe('BankAccountAddNextPage', () => {
  let component: BankAccountAddNextPage;
  let fixture: ComponentFixture<BankAccountAddNextPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountAddNextPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountAddNextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
