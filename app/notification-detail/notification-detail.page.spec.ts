import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDetailPage } from './notification-detail.page';

describe('NotificationDetailPage', () => {
  let component: NotificationDetailPage;
  let fixture: ComponentFixture<NotificationDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
