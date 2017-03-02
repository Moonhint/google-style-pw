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
    // this.run_auto_search_text()
  }

  // run_auto_search_text(){
  //   for (let i = 0; i < this.auto_fill_texts.length; i++) {
  //     let setup_timer = function(n) {
  //       let self = this;
  //       setTimeout(function(){
  //         self.auto_text = self.auto_fill_texts[n];
  //       }, (3000 * n));
  //     }
  //     setup_timer.call(this, i);
  //   }
  // }
}
