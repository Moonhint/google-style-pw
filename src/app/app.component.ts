import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  auto_fill_texts: string[] = [
    "Hi...",
    "My name is Antoni",
    "I am a JS Fullstack Developer",
    "We ought to work together?",
    "Still waiting?",
    "You have to click!",
    "Front End or Back End Developer"];
  auto_text: string = "";

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
        'menu-button',
        sanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu-button.svg'));
  }

  ngOnInit(){

  }

}
