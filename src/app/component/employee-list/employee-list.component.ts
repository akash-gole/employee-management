import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeDBService } from '../../services/employee-db.service';
import { Employee } from '../../model/employee';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { ToastService } from '../../services/toast.service';
import { ShareDataService } from '../../services/share-data.service';

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
  swipeThreshold = 1;
  currentXPosition: number = 0;
  longPressTimeout: any;
  constructor(
    private route: Router,
    private employeeDBService: EmployeeDBService,
    private toastService: ToastService,
    private shareDataService: ShareDataService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  onDragMoved(event: CdkDragMove, index: number, emp: Employee) {
    const xPosition = event.pointerPosition.x;
    const cardElement = event.source.element.nativeElement;

    const deltaX = xPosition - cardElement.offsetLeft;
    emp.currentX = deltaX;
  }

  onDragEnded(event: CdkDragEnd, index: number, emp: Employee) {
    const cardElement = event.source.element.nativeElement;

    if (emp.currentX < -this.swipeThreshold) {
      emp.isDeleting = true;
      cardElement.style.transform = 'translateX(-20%)'; // Show delete button
    } else {
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
    this.employeeDBService.deleteEmployee(emp?.id).subscribe(() => {
      this.loadEmployees();
      this.shareDataService.setDeletedData(emp);
      this.toastService.show('Employee data has been deleted', 'Undo');
    });
  }

  onLongPressStart(event: Event, employee: any) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    target.classList.add('long-press');

    this.longPressTimeout = setTimeout(() => {
      this.editEmployee(employee);
      target.classList.remove('long-press');
    }, 800);
  }

  onLongPressEnd(event: Event) {
    event.preventDefault();
    clearTimeout(this.longPressTimeout);
    const target = event.target as HTMLElement;
    target.classList.remove('long-press');
  }

  editEmployee(employee: any) {
    this.route.navigate(['add-employee', employee?.id]);
  }
}
