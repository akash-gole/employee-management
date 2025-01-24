import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnDestroy,
} from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject, takeUntil } from 'rxjs';
import { ShareDataService } from '../../services/share-data.service';

@Component({
  selector: 'custom-header',
  template: `
    <div class="custom-header">
      <button mat-button (click)="setDate('today')">Today</button>
      <button mat-button (click)="setDate('nextMonday')">Next Monday</button>
      <button mat-button (click)="setDate('nextTuesday')">Next Tuesday</button>
      <button mat-button (click)="setDate('afterWeek')">After 1 Week</button>
    </div>
    <div class="example-header">
      <mat-icon matPrefix (click)="previousClicked('month')"
        >arrow_left</mat-icon
      >
      <span class="example-header-label">{{ periodLabel }}</span>
      <mat-icon matPrefix (click)="nextClicked('month')">arrow_right</mat-icon>
    </div>
  `,
  styles: [
    `
      .custom-header {
        display: grid;
        gap: 10px;
        margin-bottom: 8px;
        padding: 10px;
        grid-template-columns: auto auto;
      }

      .custom-header button {
        background-color: #e3f2fd;
        border: none;
        padding: 4px 12px;
        font-size: 12px;
        cursor: pointer;
        color: #1e88e5;
      }

      .example-header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5em;
        margin-bottom: 8px;
      }

      .example-header-label {
        flex: 0.5;
        height: 1em;
        font-weight: 500;
        text-align: center;
      }

      .example-double-arrow .mat-icon {
        margin: -22%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomHeaderComponent implements OnDestroy {
  private _destroyed = new Subject<void>();
  shareDataService = inject(ShareDataService);
  constructor(
    private calendar: MatCalendar<Date>,
    private _dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef
  ) {
    calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  setDate(option: string) {
    const today = new Date();
    let selectedDate: Date = today;

    switch (option) {
      case 'today':
        selectedDate = today;
        break;
      case 'nextMonday':
        selectedDate = this.getNextDay(today, 1); // Monday
        break;
      case 'nextTuesday':
        selectedDate = this.getNextDay(today, 2); // Tuesday
        break;
      case 'afterWeek':
        selectedDate = new Date(today.setDate(today.getDate() + 7));
        break;
    }

    this.calendar.activeDate = selectedDate;
    this.calendar.selected = selectedDate;
    const syntheticEvent = new Event('dateSelected');
    this.calendar._userSelection.emit({
      value: selectedDate,
      event: syntheticEvent,
    });
    this.shareDataService.setsData(selectedDate);
  }

  private getNextDay(date: Date, dayOfWeek: number): Date {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));
    return resultDate;
  }

  get periodLabel() {
    const date = this.calendar.activeDate;
    return `${date.getDate()} ${
      this._dateAdapter.getMonthNames('short')[date.getMonth()]
    } ${date.getFullYear()}`;
  }

  previousClicked(mode: 'month' | 'year') {
    this.calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1)
        : this._dateAdapter.addCalendarYears(this.calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this.calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this.calendar.activeDate, 1);
  }
}
