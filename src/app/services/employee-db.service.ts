import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeDBService {
  constructor(private dbService: NgxIndexedDBService) {}

  // Add an employee
  addEmployee(employee: any): Observable<number> {
    return this.dbService.add('employees', employee);
  }

  // Get all employees
  getAllEmployees(): Observable<any[]> {
    return this.dbService.getAll('employees');
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<any> {
    return this.dbService.getByKey('employees', id);
  }

  // Update employee
  updateEmployee(id: number, employee: any): Observable<any> {
    return this.dbService.update('employees', { id, ...employee });
  }

  // Delete employee
  deleteEmployee(id: number): Observable<any> {
    return this.dbService.delete('employees', id);
  }
}
