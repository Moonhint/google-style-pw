import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FrontEndDevComponent } from './front-end-dev/front-end-dev.component';
import { BackEndDevComponent } from './back-end-dev/back-end-dev.component';
import { ContactComponent } from './contact/contact.component';
import { GoogleResumeComponent } from './google-resume/google-resume.component';

import { FocusDirective } from './directives/focus.attr-dir';
import { HighlightDirective } from './directives/highlight.attr-dir';
import { AutoFillDirective } from './directives/auto-fill.attr-dir';
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FrontEndDevComponent,
    BackEndDevComponent,
    ContactComponent,
    GoogleResumeComponent,
    FocusDirective,
    HighlightDirective,
    AutoFillDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule.forRoot([
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'google-resume',
        component: GoogleResumeComponent
      },
      {
        path: 'front-end-dev',
        component: FrontEndDevComponent
      },
      {
        path: 'back-end-dev',
        component: BackEndDevComponent
      }
    ])
  ],
  providers: [
    { provide: "windowObject", useValue: window}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
