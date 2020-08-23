import { ServerApiService } from './../server-api.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface Filters {
  [x: string]: any,
}

interface Person {
  id: string,
  name: string,
  age: number,
  gender: string,
  department: string,
  address: {
    city: string,
    street: string
  }
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.sass']
})
export class FilterComponent implements OnInit {

  persons: Person[] = [];
  @Output() toggle = new EventEmitter<Person[]>();

  currentFilters: Filters = {};
  currentPersons: Person[] = [];
  checkedInputs = [];
  serverApi = new ServerApiService();

  constructor() { }

  addProperty(property, section) {
    if (!this.currentFilters[section]) this.currentFilters[section] = {};

    if (this.currentFilters[section].hasOwnProperty(property)) {
      this.currentFilters[section][property]++;
    } else {
      this.currentFilters[section][property] = 1;
    }
  }

  calculateFilters(array = this.persons) {
    array.forEach(person => {
      const departmentProperty = person.department;
      const cityProperty = person.address.city;
      const genderProperty = person.gender;

      this.addProperty(departmentProperty, 'department');
      this.addProperty(cityProperty, 'city');
      this.addProperty(genderProperty, 'gender');
    });
  }

  ngOnInit(): void {
    this.serverApi.getData().subscribe(
      response => {
        this.persons = response;
        this.calculateFilters();
        this.currentPersons = this.persons;
        this.toggle.emit(this.currentPersons);
      }
    );
  }

  ngAfterViewChecked() {
    try {
      if (this.checkedInputs.length) {
        this.checkedInputs.forEach(elem => document.getElementById(`${elem}`).setAttribute('checked', 'true'));
      }
    } catch {
      return;
    }

  }

  removeFilter() {
    if (this.checkedInputs.length == 0) {
      this.currentPersons = this.persons;
      this.renderFilters();
    } else {
      let arr = this.persons;
      this.checkedInputs.forEach(checkbox => {
        arr = arr.filter(elem => JSON.stringify(elem).includes(`"${checkbox}"`));
      })
      this.currentPersons = arr;
      this.renderFilters();
    }
  }

  renderFilters() {
    this.currentFilters = [];
    this.calculateFilters(this.currentPersons);
  }

  toggleCheckbox(filter) {
    if (this.checkedInputs.includes(filter.key)) {
      this.checkedInputs = this.checkedInputs.filter(elem => elem != filter.key);
    } else {
      this.checkedInputs.push(filter.key);
    }
  }

  onToggle(filter, evt) {
    if (evt.target.checked) {
      this.currentPersons = this.currentPersons.filter(elem => {
        return JSON.stringify(elem).includes(`"${filter.key}"`);
      });
      this.renderFilters();
      this.toggleCheckbox(filter);
    } else {
      this.toggleCheckbox(filter);
      this.removeFilter();
      this.renderFilters();
    }
    this.toggle.emit(this.currentPersons);
  }

}
