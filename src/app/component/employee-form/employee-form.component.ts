import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomHeaderComponent } from '../custome-date-header/custome-date-header.component';
import { ShareDataService } from '../../services/share-data.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomHeaderComponent2 } from '../custome-date-header/custome-date-header2.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent {
  customHeader = CustomHeaderComponent;
  customHeader2 = CustomHeaderComponent2;
  roles = ['Product Designer', 'Flutter Developer', 'QA Tester', 'Product Owner'];
  startDate: Date | null = new Date();// Default to today
  endDate: Date | null = null; // No default for the end date

  shareDataService = inject(ShareDataService)

  constructor(private formBuilder: FormBuilder) {
    effect(() => {
      
      this.startDate = this.shareDataService.getsData();
      this.endDate = this.shareDataService.geteData();
      // this.form.get('joinDate')?.setValue(this.startDate);
     
      console.log("this.endDate", this.endDate);
    })
  }

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    role: ['', Validators.required],
    joinDate: [this.startDate, Validators.required],
    lastDate: [this.endDate]
  });

  onSubmitEvent(): void {
    console.log(this.form);
  }

  saveDate(event: any) {
    console.log(event.value);
  }

  applyFunction() {
    console.log("this.form",this.form);
    console.log("this.endDate",this.endDate);
    if(!this.endDate) {
      this.form.get('lastDate')?.setValue(null);
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log('Date changed:', event.value); // event.value contains the selected date
    this.shareDataService.seteData(event.value);
  }

  
}
