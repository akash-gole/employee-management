import { Injectable, signal } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class ShareDataService {

    data = signal<Date>(new Date());

    constructor() {}

    setData(data:Date) {
        this.data.update(()=> data);
    }

    getData(): any {
        return this.data();
    }
}