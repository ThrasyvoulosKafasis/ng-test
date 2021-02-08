import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as randomWords from 'random-words';
import { BehaviorSubject, combineLatest, fromEvent, Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

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

  // Seems to have no functionality
  // emptyArray = new Array(1000); 

  // pagination variables
  page: number = 1;
  pageSize: number = 20;
  // totalPages: number = 0;

  // search variable
  name = new FormControl('');
  searchInput = new FormControl('');

  // data variables
  data: IEntry[];
  private dataSubject: BehaviorSubject<IEntry[]> = new BehaviorSubject<IEntry[]>([]);
  pageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  paginatedData$: Observable<IEntry[]>;

  // ;
  // filteredData$: IEntry[] = [];

  ngOnInit() {

    this.initRandomData();

    combineLatest()

    // calculate the initial total pages
    this.calculateTotalPages(this.data);

    // paginate with the initial values
    this.paginateData();
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

  }

  trackByName(index: number, entry: IEntry): string {
    return entry.name;
  }

  ngAfterViewInit() {

    // // observable for the keyup event on input element
    // fromEvent(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     // get filter value from event
    //     map(($e: KeyboardEvent) => ($e.target as HTMLInputElement).value),
    //     // wait 300 ms
    //     debounceTime(300),
    //     // emit when the current value is different than the last 
    //     distinctUntilChanged()
    //   )
    //   .subscribe(filter => this.populateFilteredData(filter));
  }

  // set filtered data based on search input
  populateFilteredData(filter: string = '') {

    // if (!filter) {

    //   this.filteredData$ = [...this.data];

    // } else {

    //   // split string to arrays
    //   const strArray = filter.trim().split(' ');

    //   // new set to add all entries that match the search criteria
    //   let set = new Set<IEntry>();

    //   strArray.forEach(word => {

    //     const lowerWord: string = word.toLowerCase();

    //     [...this.data].forEach(entry => {
    //       for (let key of Object.keys(entry)) {
    //         if (entry[key].toLowerCase().includes(lowerWord)) {
    //           set.add(entry);
    //           break;
    //         }
    //       }
    //     });
    //   });

    //   this.filteredData$ = Array.from(set);
    // }

    // this.paginateData(this.filteredData$);
  }

  // set data based on pagination values
  paginateData(array = []) {

    // // if no array provided get the initial array
    // const data = (array.length === 0) ? this.data.slice(0) : array;

    // // re-calculate total pages
    // this.calculateTotalPages(data);

    // const start = (this.page - 1) * this.pageSize;
    // const end = this.page * this.pageSize;

    // // emit data
    // this.subject.next(data.slice(start, end));
  }

  // previous page button clicked
  prevPageBtnClicked() {
    // if (this.page > 1) {
    //   this.page--;
    //   this.paginateData(this.filteredData$);
    // }
  }

  // next page button clicked
  nextPageBtnClicked() {
    // if (this.page < this.totalPages) {
    //   this.page++;
    //   this.paginateData(this.filteredData$);
    // }
  }

  // calculate the total pages for pagination
  calculateTotalPages(array: IEntry[]) {
    // this.totalPages = Math.ceil(array.length / this.pageSize);
  }
}
