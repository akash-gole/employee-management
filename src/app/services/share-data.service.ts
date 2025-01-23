import { Injectable, signal } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class ShareDataService {

    sdata = signal<Date>(new Date());
    edata = signal<Date | null>(null);

    constructor() {}

    setsData(data:Date) {
        this.sdata.update(()=> data);
    }

    getsData(): any {
        return this.sdata();
    }

    seteData(data:Date | null) {
        console.log("seteData", data)
        this.edata.update(()=> data);
    }

    geteData(): any {
        return this.edata();
    }
}