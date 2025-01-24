import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ShareDataService } from './share-data.service';
import { EmployeeDBService } from './employee-db.service';

@Injectable({ providedIn: 'root' })
export class ToastService {
  [x: string]: any;
  constructor(
    private snackBar: MatSnackBar,
    private shareDataService: ShareDataService,
    private employeeDBService: EmployeeDBService,
  ) {}

  show(message: string, action?: string) {
    // this.snackBar.open(message, action, {
    //   duration: 30000000000, // Adjust duration as needed
    //   horizontalPosition: 'center',
    //   verticalPosition: 'bottom',
    // });

    const snackBarRef: MatSnackBarRef<any> = this.snackBar.open(
      message,
      action,
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );

    snackBarRef.afterDismissed().subscribe((dismiss) => {
      if (dismiss.dismissedByAction) {
        // Revert the deletion logic here
        this.employeeDBService.addEmployee(this.shareDataService.getDeletedData()).subscribe((id) => {
            window.location.reload();
          });
      } else {
        this.shareDataService.setDeletedData(null);
      }
    });
  }
}
