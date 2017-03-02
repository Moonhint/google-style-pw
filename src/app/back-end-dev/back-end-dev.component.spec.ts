import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackEndDevComponent } from './back-end-dev.component';

describe('BackEndDevComponent', () => {
  let component: BackEndDevComponent;
  let fixture: ComponentFixture<BackEndDevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackEndDevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackEndDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
