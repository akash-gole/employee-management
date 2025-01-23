import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './component/employee-list/employee-list.component';
import { EmployeeFormComponent } from './component/employee-form/employee-form.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
    data: { title: 'Employee List' },
  },
  {
    path: 'add-employee',
    component: EmployeeFormComponent,
    data: { title: 'Add Employee Details' },
  },
  {
    path: 'add-employee/:id',
    component: EmployeeFormComponent,
    data: { title: 'Edit Employee Details' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
