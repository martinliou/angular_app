import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountDetailPage } from './bank-account-detail.page';

describe('BankAccountDetailPage', () => {
  let component: BankAccountDetailPage;
  let fixture: ComponentFixture<BankAccountDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
