import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as randomWords from 'random-words';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
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

  data: IEntry[];

  // Seems to have no functionality
  // emptyArray = new Array(1000); 

  // pagination variables
  page: number = 1;
  pageSize: number = 2;
  totalPages: number = 0

  private subject = new BehaviorSubject<IEntry[]>([]);
  filteredData$: Observable<IEntry[]> = this.subject.asObservable();

  @ViewChild('input')
  input: ElementRef;

  ngOnInit() {

    this.data = [];

    // create random data
    for (let i = 0; i < 10000; i++) {
      this.data.push({
        name: randomWords({ exactly: 3, join: ' ' }),
        description: randomWords({ exactly: 100, join: ' ' }),
        status: ['new', 'submitted', 'failed'][Math.floor(Math.random() * 3)]
      });
    }

    // calculate the initial total pages
    this.totalPages = Math.ceil(this.data.length / this.pageSize);

    // paginate with the initial values
    this.paginateData();
  }

  ngAfterViewInit() {

    // observable for the keyup event on input element
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        // wait 300 ms
        debounceTime(500),
        // emit when the current value is different than the last 
        distinctUntilChanged(),
        // what to do after every emission on the source Observable
        tap(($e: KeyboardEvent) => this.populateFilteredData(($e.target as HTMLInputElement).value))
      )
      .subscribe();
  }

  // set filtered data based on search input
  populateFilteredData(filter: string = '') {

    let newData = [];

    if (!filter) {

      newData = this.data.slice();

    } else {

      // split string to arrays
      const strArray = filter.trim().split(' ');

      // new set to add all entries that match the search criteria
      let set = new Set<IEntry>();

      strArray.forEach(word => {
        this.data.slice(0).forEach(entry => {
          Object.keys(entry).some(key => {
            if (entry[key].toLowerCase().includes(word.toLowerCase())) {
              set.add(entry);
            }
          })
        });
      });

      newData = Array.from(set);
    }

    this.paginateData(newData);
  }

  // set data based on pagination values
  paginateData(array = []) {
    const start = (this.page - 1) * this.pageSize;
    const end = this.page * this.pageSize;

    // if no array provided get the initial array
    const data = (array.length === 0) ? this.data.slice(0) : array;
    this.calculateTotalPages(data);

    console.log('paginateData', data.length);

    this.subject.next(data.slice(start, end));
  }

  // previous page button clicked
  prevPageBtnClicked() {
    if (this.page > 1) {
      this.page--;
      this.paginateData();
    }
  }

  // next page button clicked
  nextPageBtnClicked() {
    if (this.page < this.totalPages) {
      this.page++;
      this.paginateData();
    }
  }

  calculateTotalPages(array) {
    this.totalPages = Math.ceil(data.length / this.pageSize);
  }
}
