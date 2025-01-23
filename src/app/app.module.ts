import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeListComponent } from './component/employee-list/employee-list.component';
import { EmployeeFormComponent } from './component/employee-form/employee-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import {
  MAT_DATE_FORMATS,
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  DateAdapter,
  MatDateFormats,
} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomHeaderComponent } from './component/custome-date-header/custome-date-header.component';
import { CustomHeaderComponent2 } from './component/custome-date-header/custome-date-header2.component';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

// export const CUSTOM_DATE_FORMATS: MatDateFormats = {
//   parse: {
//     dateInput: 'd MMM yyyy',
//   },
//   display: {
//     dateInput: 'd MMM yyyy',
//     monthYearLabel: 'MMM yyyy',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM yyyy',
//   },
// };

const dbConfig: DBConfig = {
  name: 'EmployeeDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'employees',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'role', keypath: 'role', options: { unique: false } },
        { name: 'joinDate', keypath: 'joinDate', options: { unique: false } },
        { name: 'lastDate', keypath: 'lastDate', options: { unique: false } },
      ],
    },
  ],
};

const matmodules = [
  MatToolbarModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule
];

@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    EmployeeFormComponent,
    CustomHeaderComponent,
    CustomHeaderComponent2
  ],
  imports: [
    BrowserModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    matmodules,
  ],
  providers: [
    // { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    // { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Optional: Set locale for consistent formatting
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); // Set to your preferred locale
  }
}
