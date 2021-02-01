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
  page: number = 1;
  pageSize: number = 2;
  totalPages: number = 0

  // emptyArray = new Array(1000);

  private subject = new BehaviorSubject<IEntry[]>([]);
  filteredData$: Observable<IEntry[]> = this.subject.asObservable();

  @ViewChild('input')
  input: ElementRef;

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

    // calculate the initial total pages
    this.totalPages = Math.ceil(this.data.length / this.pageSize);

    this.populateFilteredData('');

    this.paginateData();

  }

  ngAfterViewInit() {

    // observable for the keyup event on input element
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(($e: KeyboardEvent) => this.populateFilteredData(($e.target as HTMLInputElement).value))
      )
      .subscribe();
  }

  populateFilteredData(filter: string) {

    if (!filter) {

      this.subject.next(this.data.slice());

    } else {

      const data: IEntry[] = this.subject.getValue();

      const newData = data.slice(0).filter(entry => {
        return entry.name.indexOf(filter) !== -1
          || entry.description.indexOf(filter) !== -1
          || entry.status.indexOf(filter) !== -1;
      })

      this.subject.next(newData);
    }

  }

  paginateData() {

    const data: IEntry[] = this.subject.getValue();

    const newData = data.slice(0);

    this.subject.next(newData.slice(this.page - 1, this.page * this.pageSize));
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

      console.log('nextPageBtnClicked', this.page);

      this.paginateData();
    }
  }
}
