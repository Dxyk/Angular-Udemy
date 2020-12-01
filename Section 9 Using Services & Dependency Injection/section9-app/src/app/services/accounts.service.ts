import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable()
export class AccountsService {
  accounts = [
    {
      name: 'Master Account',
      status: 'active',
    },
    {
      name: 'Test Account',
      status: 'inactive',
    },
    {
      name: 'Hidden Account',
      status: 'unknown',
    },
  ];

  constructor(private loggingService: LoggingService) {}

  addAccount(name: string, status: string) {
    this.loggingService.logStatusChange(status);
    this.accounts.push({ name: name, status: status });
  }

  updateAccount(id: number, status: string) {
    this.loggingService.logStatusChange(status);
    this.accounts[id].status = status;
  }
}
