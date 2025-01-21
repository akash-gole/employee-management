import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, first } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  headerTitle: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        console.log(this.route?.queryParams)
        this.handleRouteChange(this.route);
      });
  }

  private handleRouteChange(route: ActivatedRoute) {
    const child = this.getDeepestChild(route);

    // Get the title from route data
    if (child.snapshot.data && child.snapshot.data['title']) {
      this.headerTitle = child.snapshot.data['title'];
    } else {
      this.headerTitle = 'Employee List'; // Fallback if no title is provided
    }
  }

  private getDeepestChild(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
