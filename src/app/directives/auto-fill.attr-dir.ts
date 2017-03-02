import {Directive, Inject, Input, ElementRef} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Directive({
    selector: '[autofill]'
})
export class AutoFillDirective {
    @Input('autofilltexts') autofilltexts: string[];
    texts : any[] = [];

    constructor(@Inject(ElementRef) private element: ElementRef) {

    }

    ngOnInit(){
      this.texts = [];

      for (let i = 0; i < this.autofilltexts.length; i++) {
        this.texts.push({
          intent: 'type',
          value: this.autofilltexts[i]
        });

        if ((i + 1) !== this.autofilltexts.length){
          this.texts.push({
            intent: 'delete',
            value: this.autofilltexts[i]
          });

          this.texts.push({
            intent: 'delay',
            value: true
          });
        }
      }
      this.run_auto_search_text();
    }

    run_auto_search_text(){
      const typing_time = 200;
      const typing_acceleration = 0.5;
      const delay_time = 1500;

      let type_ahead = function(word){
         let self = this;
         let chars = word.split('');
         let len = chars.length;

         return new Promise((resolve, reject) => {
           for (let i = 0; i < chars.length; i++) {
             setTimeout(function(){
               self.element.nativeElement.value += chars[i];
               if (i+1 === len){
                 setTimeout(function(){
                   resolve(true);
                 }, delay_time);
               }
             }, (typing_time * typing_acceleration * i));
           }
         });
      }

      let delete_ahead = function(word){
        let self = this;
        let chars = word.split('');
        let len = chars.length;

        return new Promise((resolve, reject) => {
          for (let i = 0; i < chars.length; i++) {
            setTimeout(function(){
              chars.pop();
              self.element.nativeElement.value = chars.join("");
              if (i + 1 === len){
                resolve(true);
              }
            }, (typing_time * typing_acceleration * i));
          }
        });
      }

      let delay_ahead = function(){
        let self = this;

        return new Promise((resolve, reject) => {
            setTimeout(function(){
              resolve(true);
            }, (delay_time));
        });
      }

      this.texts.reduce((process, word, index, arr) => {
        return process.then((condition)=>{
          if (word.intent === 'type'){
            return type_ahead.call(this, word.value);
          }else if (word.intent === 'delete'){
            return delete_ahead.call(this, word.value);
          }else {
            return delay_ahead.call(this);
          }
        });
      }, Promise.resolve(true));

    }
}
