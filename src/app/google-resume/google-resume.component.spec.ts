import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleResumeComponent } from './google-resume.component';

describe('GoogleResumeComponent', () => {
  let component: GoogleResumeComponent;
  let fixture: ComponentFixture<GoogleResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
