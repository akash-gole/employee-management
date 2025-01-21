import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent {
  employees = [];
  constructor(private route: Router) {}

  addEmployee() {
    console.log('FAB clicked!');
    this.route.navigate(['add-employee']);
  }
}
