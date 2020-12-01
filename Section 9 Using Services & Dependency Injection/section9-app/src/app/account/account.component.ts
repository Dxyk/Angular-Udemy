import { Component, Input } from '@angular/core';
import { AccountsService } from '../services/accounts.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  @Input()
  account: { name: string; status: string };

  @Input()
  id: number;

  constructor(private accountsService: AccountsService) {}

  onSetTo(status: string) {
    this.accountsService.updateAccount(this.id, status);
    this.accountsService.statusUpdated.emit(status);
  }
}
