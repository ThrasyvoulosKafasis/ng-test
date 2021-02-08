import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as randomWords from 'random-words';
import { BehaviorSubject, combineLatest, fromEvent, Observable, of, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, tap } from 'rxjs/operators';

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

  // pagination variables
  page: number = 1;
  totalPages: number = 0;

  // search variable
  searchInput = new FormControl('');

  // data variables
  data: IEntry[];
  private dataRowsSubject: BehaviorSubject<IEntry[]> = new BehaviorSubject<IEntry[]>([]);
  pageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  dataWithFilteringAndPaging$: Observable<IEntry[]>;

  ngOnInit() {

    this.initRandomData();

    this.dataWithFilteringAndPaging$ = combineLatest(
      this.pageSubject,
      this.dataRowsSubject,
      this.searchInput.valueChanges
        .pipe(
          startWith(''),
          // wait 300 ms
          debounceTime(300),
          // emit when the current value is different than the last 
          distinctUntilChanged()
        )
    )
      .pipe(
        map(([page, rows, searchValue]) => {

          const pageSize: number = 20;

          let filtered = this.filterData(rows, searchValue);

          this.totalPages = Math.ceil(filtered.length / pageSize);

          return filtered.slice((page - 1) * pageSize, page * pageSize);
        })
      );
  }

  // create random data
  initRandomData() {

    this.data = [];

    for (let i = 0; i < 10000; i++) {
      this.data.push({
        name: randomWords({ exactly: 3, join: ' ' }),
        description: randomWords({ exactly: 100, join: ' ' }),
        status: ['new', 'submitted', 'failed'][Math.floor(Math.random() * 3)]
      });
    }

    this.dataRowsSubject.next(this.data);
  }

  trackByName(index: number, entry: IEntry): number {
    return index;
  }

  // set filtered data based on search input
  filterData(data: IEntry[], filter: string = '') {

    if (!filter) {
      return data;
    }

    // split string to arrays
    const strArray = filter.trim().split(' ');

    // new set to add all entries that match the search criteria
    let set = new Set<IEntry>();

    strArray.forEach(word => {

      const lowerWord: string = word.toLowerCase();

      data.forEach(entry => {
        for (let key of Object.keys(entry)) {
          if (entry[key].toLowerCase().includes(lowerWord)) {
            set.add(entry);
            break;
          }
        }
      });
    });

    return Array.from(set);
  }

  // change pagination current page
  changePage(toNext: boolean) {
    this.pageSubject.next(toNext ? ++this.page : --this.page);
  }
}