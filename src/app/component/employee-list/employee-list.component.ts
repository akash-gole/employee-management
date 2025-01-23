import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeDBService } from '../../services/employee-db.service';
import { Employee } from '../../model/employee';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  currentEmployees: Employee[] = [];
  previousEmployees: Employee[] = [];
  draggingIndex: number | null = null;
  swipeThreshold = 10; // Threshold to delete the item
  currentXPosition: number = 0; // Tracks the drag movement
  constructor(
    private route: Router,
    private employeeDBService: EmployeeDBService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  onDragMoved(event: CdkDragMove, index: number, emp:Employee) {
    const xPosition = event.pointerPosition.x;
    const cardElement = event.source.element.nativeElement;

    // Calculate the translation relative to the card's initial position
    const deltaX = xPosition - cardElement.offsetLeft;
      // Update currentX position for this specific card
      emp.currentX = deltaX;
      cardElement.style.transform = `translateX(${deltaX}px)`;
  }

  onDragEnded(event: CdkDragEnd, index: number, emp:Employee) {
    const cardElement = event.source.element.nativeElement;

    if (emp.currentX < -this.swipeThreshold) {
      emp.isDeleting = true;
      cardElement.style.transform = 'translateX(0%)'; // Show delete button
    } else {
      // Reset position if the drag was too short
      emp.currentX = 0;
      emp.isDeleting = false;
      cardElement.style.transform = 'translateX(0)';
    }
  }

  loadEmployees() {
    const currentDate = new Date();
    this.employeeDBService.getAllEmployees().subscribe((data) => {
      this.employees = data;
      this.currentEmployees = data.filter(
        (employee) =>
          !employee.lastDate || new Date(employee.lastDate) > currentDate
      );

      this.previousEmployees = data.filter(
        (employee) =>
          employee.lastDate && new Date(employee.lastDate) <= currentDate
      );
    });
  }

  addEmployee() {
    this.route.navigate(['add-employee']);
  }

  deleteEmployee(emp: any) {
    console.log('emp', emp);
    this.employeeDBService.deleteEmployee(emp?.id).subscribe(() => {
      console.log('Employee deleted:', emp);
      this.loadEmployees();
    });
  }
}
