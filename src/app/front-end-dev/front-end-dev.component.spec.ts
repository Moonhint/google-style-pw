import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontEndDevComponent } from './front-end-dev.component';

describe('FrontEndDevComponent', () => {
  let component: FrontEndDevComponent;
  let fixture: ComponentFixture<FrontEndDevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontEndDevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontEndDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
