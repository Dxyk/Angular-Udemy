import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', { static: false })
  nameInputRef: ElementRef<HTMLInputElement>;

  @ViewChild('amountInput', { static: false })
  amountInputRef: ElementRef<HTMLInputElement>;

  @Output()
  ingredientAdded = new EventEmitter<Ingredient>();

  constructor() {}

  ngOnInit() {}

  onAddItem() {
    this.ingredientAdded.emit({
      name: this.nameInputRef.nativeElement.value,
      amount: Number(this.amountInputRef.nativeElement.value),
    });
  }
}
