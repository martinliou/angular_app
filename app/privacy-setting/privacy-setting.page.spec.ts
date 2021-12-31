import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacySettingPage } from './privacy-setting.page';

describe('PrivacySettingPage', () => {
  let component: PrivacySettingPage;
  let fixture: ComponentFixture<PrivacySettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacySettingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacySettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
