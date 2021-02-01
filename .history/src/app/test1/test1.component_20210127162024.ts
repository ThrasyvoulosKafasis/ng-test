import { Component, OnInit } from '@angular/core';
import * as randomWords from 'random-words';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, map
} from 'rxjs/operators';

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

  page = 1;
  pageSize = 20;
  emptyArray = new Array(1000);

  data: IEntry[];
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

    this.filteredData$ = this.data.slice();

    // this.populateFilteredData('');

  }

  populateFilteredData(filter) {

    // const t0 = performance.now();

    // console.log(filter);

    // if (!filter) {
    //   this.filteredData$ = this.data.slice();
    //   // this.filteredData = ;
    // }

    // this.filteredData$.pipe(
    //   map(entry => entry),
    //   // filter(entry => {
    //   //   return entry.name.indexOf(filter) !== -1
    //   //     || entry.description.indexOf(filter) !== -1
    //   //     || entry.status.indexOf(filter) !== -1
    //   // }),
    //   // debounceTime(300),
    //   // distinctUntilChanged(),
    // );

    // this.filteredData = this.data.filter(
    //   o => Object.keys(o).some(
    //     k => o[k].toLowerCase()
    //       .includes(filter.toLowerCase())
    //   ));

    // this.filteredData = this.data.filter(entry => {
    //    ;
    // });

    // const t1 = performance.now();
    // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")

  }

  updateFilter($event: KeyboardEvent) {

    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      );

    this.populateFilteredData(($event.target as HTMLInputElement).value);
  }

}
