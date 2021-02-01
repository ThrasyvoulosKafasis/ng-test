import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as randomWords from 'random-words';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

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

  @ViewChild('input', { static: true })
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

    this.populateFilteredData('');

  }

  ngAfterViewInit() {

    // (input)="updateFilter($event)"

    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        // filter(Boolean),
        debounceTime(150),
        distinctUntilChanged(),
        tap(text => this.populateFilteredData(text))
      );
    // .subscribe();
  }

  populateFilteredData(filter) {

    if (!filter) {

      this.subject.next(this.data.slice());

    }

    const data: IEntry[] = this.subject.getValue();

    const newData = data.filter(entry => {
      return entry.name.indexOf(filter) !== -1
        || entry.description.indexOf(filter) !== -1
        || entry.status.indexOf(filter) !== -1;
    })

    this.subject.next(newData);
  }
}
