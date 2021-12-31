import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiseDetailPage } from './advertise-detail.page';

describe('AdvertiseDetailPage', () => {
  let component: AdvertiseDetailPage;
  let fixture: ComponentFixture<AdvertiseDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertiseDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertiseDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
