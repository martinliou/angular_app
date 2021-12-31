import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryOrderDetailPage } from './history-order-detail.page';

describe('HistoryOrderDetailPage', () => {
  let component: HistoryOrderDetailPage;
  let fixture: ComponentFixture<HistoryOrderDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryOrderDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryOrderDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
