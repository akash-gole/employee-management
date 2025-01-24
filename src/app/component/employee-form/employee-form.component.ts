import {
  Component,
  effect,
  HostListener,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomHeaderComponent } from '../custome-date-header/custome-date-header.component';
import { ShareDataService } from '../../services/share-data.service';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { CustomHeaderComponent2 } from '../custome-date-header/custome-date-header2.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { EmployeeDBService } from '../../services/employee-db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck } from 'rxjs';

export const MY_FORMATS = {
  display: {
    dateInput: 'd MMM yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

class CustomDateAdapter extends MomentDateAdapter {
  override getFirstDayOfWeek(): number {
    // Ensure first day of the week is Sunday or Monday based on your requirements
    return 1; // Sunday (default for many regions)
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    // Ensure this aligns with the behavior of `getNextDay`
    if (style === 'short') {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }
    return super.getDayOfWeekNames(style);
  }
}

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    // {
    //   provide: DateAdapter,
    //   useClass: CustomDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    // },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent {
  customHeader = CustomHeaderComponent;
  customHeader2 = CustomHeaderComponent2;
  roles = [
    'Product Designer',
    'Flutter Developer',
    'QA Tester',
    'Product Owner',
  ];
  startDate: Date | null = new Date(); // Default to today
  endDate: Date | null = null; // No default for the end date
  Id: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private employeeDBService: EmployeeDBService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private shareDataService: ShareDataService
  ) {
    effect(() => {
      this.startDate = this.shareDataService.getsData();
      this.endDate = this.shareDataService.geteData();
    });
  }


  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    role: ['', Validators.required],
    joinDate: [this.startDate, Validators.required],
    lastDate: [null],
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((empId: any) => {
      if (empId?.id) this.getData(empId?.id);
    });
  }

  endDateFilter = (date: Date | null): boolean => {
    if (!this.form.get('joinDate')?.value || !date) {
      return true; // Allow all dates if start date is not selected
    }
    // Disable dates before or equal to the start date
    return date > this.form.get('joinDate')?.value;
  };
  onSubmitEvent(): void {
    if (this.form.valid) {
      if (this.Id) {
        this.onUpdate();
      } else {
        this.employeeDBService.addEmployee(this.form.value).subscribe((id) => {
          this.router.navigate(['/']);
        });
      }
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (this.shareDataService.nodate()) {
      this.form.get('lastDate')?.setValue(null);
      this.shareDataService.nodate.set(false);
    }
    // this.shareDataService.seteData(event.value);
    // this.applyFunction()
    // this.applyFunction();
  }

  getData(id: number) {
    this.employeeDBService.getEmployeeById(+id).subscribe((data) => {
      this.form.patchValue(data);
      this.shareDataService.seteData(data.joinDate);
      this.shareDataService.seteData(data.lastDate);
      this.Id = +id;
    });
  }

  onUpdate(): void {
    if (this.form.valid) {
      this.employeeDBService
        .updateEmployee(this.Id, this.form.value)
        .subscribe((id) => {
          this.router.navigate(['/']);
        });
    }
  }
}
