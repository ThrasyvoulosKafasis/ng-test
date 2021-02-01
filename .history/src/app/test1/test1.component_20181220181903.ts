import {Component, OnInit} from '@angular/core';
import * as randomWords from 'random-words';

export interface IEntry {
  name: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.css']
})
export class Test1Component implements OnInit {

  data: IEntry[];
  page = 1;
  pageSize = 20;
  emptyArray = new Array(1000);

  filteredData: IEntry[];

  constructor() {
  }

  ngOnInit() {

    this.data = [];

    for (let i = 0; i < 10000; i++) {
      this.data.push({
        name: randomWords({exactly: 3, join: ' '}),
        description: randomWords({exactly: 100, join: ' '}),
        status: ['new', 'submitted', 'failed'][Math.floor(Math.random() * 3)]
      });
    }

    this.populateFilteredData('');

  }

  populateFilteredData(filter) {
    if (!filter) {
      this.filteredData = this.data.slice();
    }

    this.filteredData = this.data.filter(entry => {
      return entry.name.indexOf(filter) !== -1 || entry.description.indexOf(filter) !== -1 || entry.status.indexOf(filter) !== -1;
    });
  }

  updateFilter($event: KeyboardEvent) {
    this.populateFilteredData(($event.target as HTMLInputElement).value);
  }

}
