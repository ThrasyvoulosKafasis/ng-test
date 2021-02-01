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

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(300),
        distinctUntilChanged(),
        tap(($e: KeyboardEvent) => this.populateFilteredData(($e.target as HTMLInputElement).value))
      )
      .subscribe();
  }

  populateFilteredData(filter: string) {

    var t0 = performance.now();

    if (!filter) {

      this.subject.next(this.data.slice());

    } else {

      const data: IEntry[] = this.subject.getValue();

      const newData = data.filter(entry => {
        return entry.name.indexOf(filter) !== -1
          || entry.description.indexOf(filter) !== -1
          || entry.status.indexOf(filter) !== -1;
      })

      this.subject.next(newData);
    }

    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

  }
}
