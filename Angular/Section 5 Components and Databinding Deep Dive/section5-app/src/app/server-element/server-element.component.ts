import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class ServerElementComponent
  implements
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {
  // tslint:disable-next-line: no-input-rename
  @Input('serverElement')
  element: {
    type: string;
    name: string;
    content: string;
  };

  @Input()
  name: string;

  @ViewChild('heading', { static: true })
  header: ElementRef<HTMLDivElement>;

  @ContentChild('contentParagraph', { static: true })
  paragraph: ElementRef<HTMLParagraphElement>;

  constructor() {
    console.log('Constructor Called');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges Called');
    console.log(changes);
  }

  ngOnInit(): void {
    console.log('ngOnInit Called');
    console.log('Text content: ' + this.header.nativeElement.textContent);
    console.log(
      'Text content of paragraph: ' + this.paragraph.nativeElement.textContent
    );
  }

  ngDoCheck(): void {
    console.log('ngDoCheck Called');
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit Called');
    console.log(
      'Text content of paragraph: ' + this.paragraph.nativeElement.textContent
    );
  }

  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked Called');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit Called');
    console.log('Text content: ' + this.header.nativeElement.textContent);
  }

  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked Called');
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy Called');
  }
}
