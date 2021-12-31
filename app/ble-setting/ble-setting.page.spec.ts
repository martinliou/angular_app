import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BleSettingPage } from './ble-setting.page';

describe('BleSettingPage', () => {
  let component: BleSettingPage;
  let fixture: ComponentFixture<BleSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BleSettingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BleSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
