import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ShareDataService } from '../../services/share-data.service';
import { MatCalendar } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';

@Component({
  selector: 'custom-header',
  template: `
    <div class="custom-header">
      <button mat-button (click)="setDate('nodate')">No date</button>
      <button mat-button (click)="setDate('today')">Today</button>
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
export class CustomHeaderComponent2 implements OnDestroy {
  private _destroyed = new Subject<void>();
  constructor(
    private calendar: MatCalendar<Date>,
    private _dateAdapter: DateAdapter<Date>,
    private shareDataService: ShareDataService,
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
    let selectedDate: Date | null = today;

    switch (option) {
      case 'today':
        selectedDate = today;
        break;
      case 'nodate':
        selectedDate = null;
        break;
    }


    if (selectedDate) {
      this.calendar.activeDate = selectedDate;
      this.calendar.selected = selectedDate;
      const syntheticEvent = new Event('dateSelected'); // Create a synthetic event
      this.calendar._userSelection.emit({
        value: selectedDate,
        event: syntheticEvent, // You can pass a MouseEvent here if needed, otherwise null
      });
      this.shareDataService.seteData(selectedDate);
    } else {
      this.calendar.activeDate = null as unknown as Date; // Force null with TypeScript type casting
      const syntheticEvent = new Event('dateSelected'); // Create a synthetic event
      this.calendar._userSelection.emit({
        value: null,
        event: syntheticEvent, // You can pass a MouseEvent here if needed, otherwise null
      });
      this.shareDataService.seteData(null);
      this.calendar.selected = null;
      this.shareDataService.nodate.set(true);
    }
  }

  get periodLabel() {
    const date = this.calendar.activeDate;
    if (date) {
        return `${date.getDate()} ${
            this._dateAdapter.getMonthNames('short')[date.getMonth()]
          } ${date.getFullYear()}`;
    } else {
        return 'No date'
    }
    
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
