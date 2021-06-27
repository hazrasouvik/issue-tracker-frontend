import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './auth/auth.service';
import { AppComponent } from './app.component';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from './auth/auth-data.model';

class MockAuthService extends AuthService {
  users: BehaviorSubject<AuthData[]> = new BehaviorSubject<AuthData[]>([
      {
      "id": "1",
      "email": "123@gmail.com",
      "password": "123456",
      "firstName": "Test",
      "lastName": "User1",
      "location": "Kolkata",
      "mobile": "1234567890",
      "customize": {
        "description": true,
        "severity": true,
        "status": true,
        "createdDate": true,
        "resolvedDate": true,
        "creator": true,
        "lastModifiedBy": true},
      }
  ]);
  private isLoggedIn1 = false;
  loggedInUserId:string = "1";
  autoAuthUser() {
    this.loginCount+=1;
      this.isLoggedIn1 = true;
      this.getUserDetails(this.loggedInUserId).subscribe((userDetails) => {
        this.login(userDetails);
      })
  }
  getUserDetails(userId: string) {
    return this.users;
  }
  login(userDetails: any) {
    this.isLoggedIn1 = true;
    this.loggedInUserId = userDetails.id;
    return this.users;
  }
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [
        AppComponent
      ],
      providers: [{
        provide: AuthService,
        useClass: MockAuthService,
      }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have a 'isLoading' boolean variable`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.isLoading).toBeTruthy();
  });

  it('should render the Header component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });
});
