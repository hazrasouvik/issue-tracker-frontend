import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from "@angular/router";
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoading: boolean = true;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart ) {
        this.isLoading = true;
      }
      else if (event instanceof NavigationError || event instanceof NavigationCancel || event instanceof NavigationEnd) {
        this.isLoading = false;
      }
    })
  }

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
