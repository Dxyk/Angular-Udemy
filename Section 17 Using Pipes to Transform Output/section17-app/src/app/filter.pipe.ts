import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: any, filterString: string, propertyName: string): any {
    if (value.length === 0 || filterString.trim() === '') {
      return value;
    } else {
      const resultArray: any[] = [];
      for (const item of value) {
        if (item[propertyName] === filterString) {
          resultArray.push(item);
        }
      }
      return resultArray;
    }
  }
}
