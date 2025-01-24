import { Injectable, signal } from "@angular/core";
import { Employee } from "../model/employee";


@Injectable({
    providedIn: 'root'
})
export class ShareDataService {

    sdata = signal<Date>(new Date());
    edata = signal<Date | null>(null);

    nodate = signal<Boolean>(false);

    deletedEmployee = signal<Employee | null>(null)
    

    constructor() {}

    setsData(data:Date) {
        this.sdata.update(()=> data);
    }

    getsData(): any {
        return this.sdata();
    }

    seteData(data:Date | null) {
        this.edata.update(()=> data);
    }

    geteData(): any {
        return this.edata();
    }

    setDeletedData(data:Employee | null) {
        this.deletedEmployee.update(()=> data);
    }

    getDeletedData(): any {
        return this.deletedEmployee();
    }
}