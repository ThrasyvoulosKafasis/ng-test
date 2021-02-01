import { Component, OnInit } from '@angular/core';
import * as randomWords from 'random-words';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  private subject = new BehaviorSubject<IEntry[]>([]);
  filteredData$: Observable<IEntry[]> = this.subject.asObservable();

  constructor() {
  }

  ngOnInit() {

    this.data = [];

    for (let i = 0; i < 10000; i++) {
      this.data.push({
        name: randomWords({ exactly: 3, join: ' ' }),
        description: randomWords({ exactly: 100, join: ' ' }),
        status: ['new', 'submitted', 'failed'][Math.floor(Math.random() * 3)]
      });
    }

    this.populateFilteredData('');

  }

  populateFilteredData(filter) {

    if (!filter) {

      this.subject.next(this.data.slice());

    } else {

      const data: IEntry[] = this.subject.getValue();

      const newData = data.filter(entry => {
        return entry.name.indexOf(filter) !== -1
          || entry.description.indexOf(filter) !== -1
          || entry.status.indexOf(filter) !== -1;
      })

      this.filteredData$
        .pipe(
          // map(entry => )
          filter(entry => {

          })
        )

      // this.subject.next(
      //   this.data.
      // )

    }
  }

  updateFilter($event: KeyboardEvent) {
    this.populateFilteredData(($event.target as HTMLInputElement).value);
  }

}
