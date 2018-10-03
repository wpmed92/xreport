import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateBrowserComponent } from './template-browser.component';

describe('TemplateBrowserComponent', () => {
  let component: TemplateBrowserComponent;
  let fixture: ComponentFixture<TemplateBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
