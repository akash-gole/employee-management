import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { EmployeeDBService } from './services/employee-db.service';
import { ShareDataService } from './services/share-data.service';
import { ToastService } from './services/toast.service';
import { Employee } from './model/employee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  headerTitle: string = '';
  empData: Employee | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private employeeDBService: EmployeeDBService,
    private shareDataService: ShareDataService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.handleRouteChange(this.activatedRoute);
      });
  }

  private handleRouteChange(route: ActivatedRoute) {
    const child = this.getDeepestChild(route);

    if (child.snapshot.data && child.snapshot.data['title']) {
      this.headerTitle = child.snapshot.data['title'];
    } else {
      this.headerTitle = 'Employee List';
    }

    if (child.snapshot.params && child.snapshot.params['id']) {
      this.getData(child.snapshot.params['id']);
    } else {
      this.empData = null;
    }
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  deleteEmployee(emp: any) {
    this.employeeDBService.deleteEmployee(emp?.id).subscribe(() => {
      this.shareDataService.setDeletedData(emp);
      this.toastService.show('Employee data has been deleted', 'Undo');
      this.router.navigate(['/']);
    });
  }

  getData(id: number) {
    this.employeeDBService.getEmployeeById(+id).subscribe((data) => {
      this.empData = data;
    });
  }
}
