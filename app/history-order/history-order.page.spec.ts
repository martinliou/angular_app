import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryOrderPage } from './history-order.page';

describe('HistoryOrderPage', () => {
  let component: HistoryOrderPage;
  let fixture: ComponentFixture<HistoryOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
