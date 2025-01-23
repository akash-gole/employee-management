import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeDBService } from '../../services/employee-db.service';
import { Employee } from '../../model/employee';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  employees:Employee[] = [];
  currentEmployees: Employee[] = [];
  previousEmployees: Employee[] = [];
  constructor(private route: Router, private employeeDBService: EmployeeDBService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    const currentDate = new Date();
    this.employeeDBService.getAllEmployees().subscribe(
      (data) => {
        this.employees = data;
        this.currentEmployees = data.filter(
          (employee) => !employee.lastDate || new Date(employee.lastDate) > currentDate
        );

        this.previousEmployees = data.filter(
          (employee) => employee.lastDate && new Date(employee.lastDate) <= currentDate
        );
    
      }
    );
  }

  addEmployee() {
    this.route.navigate(['add-employee']);
  }
}
