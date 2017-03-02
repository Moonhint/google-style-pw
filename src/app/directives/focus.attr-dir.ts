import {Directive, Inject, Input, ElementRef} from '@angular/core';

@Directive({
    selector: '[initFocus]'
})
export class FocusDirective {
    @Input()
    focus:boolean;
    constructor(@Inject(ElementRef) private element: ElementRef) {
      
    }
}
