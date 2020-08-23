import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass']
})
export class TableComponent implements OnInit {
  @Input() persons;
  currentColumnName:string = '';
  currentClicks:number = 0;

  constructor() { }

  ngOnInit(): void {

  }

  convertForComparison(key) {
    switch (typeof key) {
      case 'object':
        return Object.values(key).join(' ');
      case 'string':
        return key.toLowerCase();
      case 'number':
        return key;
      default:
        return;
    }
  }

  compare(key, order) {
    return (a, b) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return;

      const firstItem = this.convertForComparison(a[key]);
      const secondItem = this.convertForComparison(b[key]);

      let comparison = 0;
      if (firstItem > secondItem) {
        comparison = 1;
      } else if (firstItem < secondItem) {
        comparison = -1;
      }
      return (
        (order % 2 != 0) ? (comparison * -1) : comparison
      );
    };
  }

  sortBy(columnName) {
    if (this.currentColumnName === columnName) {
      this.currentClicks++;
    } else {
      this.currentColumnName = columnName;
      this.currentClicks = 0;
    }
    this.persons.sort(this.compare(columnName, this.currentClicks));
  }
}
