import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IssuesListComponent } from './issues-list.component';

import { AuthService } from '../../auth/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthData } from '../../auth/auth-data.model';
import { IssuesService } from '../issues.service';
import { Issue } from '../issue.model';
import { SearchFilterPipe } from 'src/app/search-filter.pipe';

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
  getIsLoggedIn () {
    return true;
  }

  getUserDetails(userId: string) {
    return this.users;
  }
  getloggedInUserId() {
    return this.loggedInUserId;
  }
  login(userDetails: any) {
    this.isLoggedIn1 = true;
    this.loggedInUserId = userDetails.id;
    return this.users;
  }
};

class MockIssueService extends IssuesService {
  issues1: Issue[] = [
    { "id": "1",
  "description": "Issue1",
  "severity": "Major",
  "status": "Closed",
  "createdDate": "2021-06-23T18:30:00.000Z",
  "resolvedDate": "2021-06-24T19:05:07.997Z",
  "issueViewCount": 4,
  "creator": "Test User1",
  "lastModifiedBy": "Test User1"},
  {
    "id": "2",
    "description": "Issue2",
    "severity": "Minor",
    "status": "Open",
    "createdDate": "2021-06-23T18:30:00.000Z",
    "resolvedDate": "",
    "issueViewCount": 2,
    "creator": "Test User1",
    "lastModifiedBy": "Test User1"
  }];
  issuesPerPage = 2;
  currentPage = 1;
  getIssues(issuesPerPage: number, currentPage: number) {
    return this.issues1;
  }

  getIssueUpdateListener() {
    return new BehaviorSubject<{ issues: Issue[], issueCount: number, loggedInUserCustomize: {} | null}>({issues: this.issues1, issueCount: 2, loggedInUserCustomize: {
      "description": true,
      "severity": true,
      "status": true,
      "createdDate": true,
      "resolvedDate": true,
      "creator": true,
      "lastModifiedBy": true}})
  }

  getAllIssues() {
    return new BehaviorSubject<Issue[]>(this.issues1);
  }
}

describe('IssuesListComponent', () => {
  describe('Component class', () => {
    let comp: IssuesListComponent;
    let fixture: ComponentFixture<IssuesListComponent>;
    let issuesService: IssuesService;
    let authService: AuthService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, HttpClientModule, RouterTestingModule],
        providers: [IssuesListComponent,
          {provide: AuthService, useClass: MockAuthService},
                    {provide: IssuesService, useClass: MockIssueService}]
      });
      comp = TestBed.inject(IssuesListComponent);
      issuesService = TestBed.inject(IssuesService);
      authService = TestBed.inject(AuthService);
    }));

    it(`should create IssuesListComponent`, () => {
      expect(comp).toBeTruthy();
    });

    it('should have empty issues list after construction', () => {
      expect(comp.issues?.length).toEqual(0);
    });

    it('should have 2 issues list after ngOnInit()', () => {
      comp.ngOnInit();
      expect(comp.issues?.length).toEqual(2);
    });

    it(`should have a boolean variable 'isLoading' equal to false`, () => {
      expect(comp.isLoading).toEqual(false);
    });
  });


describe('Component DOM', () => {
  let component: IssuesListComponent;
  let fixture: ComponentFixture<IssuesListComponent>;
  let issuesService: IssuesService;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [IssuesListComponent, SearchFilterPipe],
      providers: [{provide: AuthService, useClass: MockAuthService},
                  {provide: IssuesService, useClass: MockIssueService}]
    }).compileComponents();
  }));
  beforeEach(() => {
   fixture = TestBed.createComponent(IssuesListComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
  });


  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render an Add New Issue button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('button')[2].textContent).toEqual(' Add New Issue ');
  });

  it('should render an Issue Analysis button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('button')[1].textContent).toEqual(' Issue Analysis ');
  });

  it('should render a Delete Multiple button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('button')[3].textContent).toEqual('Delete Multiple ');
  });

  it('should render 2 Issues', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-card').length).toEqual(2);
  });

  it('should render 1st issue description as Issue1', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-card')[0].querySelector('mat-card-content').querySelectorAll('p')[0].textContent).toContain("Issue1");
  });

  it('should render 2nd issue description as Issue2', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-card')[1].querySelector('mat-card-content').querySelectorAll('p')[0].textContent).toContain("Issue2");
  });

  it('should render 1 Issue when pipe is applied', () => {
    const compiled = fixture.nativeElement;
    const descriptionFilterInput = compiled.querySelector('input[type="search"]');
    component.descriptionFilter = "Issue1";
    descriptionFilterInput.dispatchEvent(new Event('search'));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('mat-card').length).toEqual(1);
  });
});
});

