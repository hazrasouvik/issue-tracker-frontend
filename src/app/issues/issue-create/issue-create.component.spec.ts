import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IssueCreateComponent } from './issue-create.component';

import { AuthService } from '../../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from '../../auth/auth-data.model';
import { IssuesService } from '../issues.service';
import { Issue } from '../issue.model';

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
  issuesList: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>([
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
    }
  ]);
  addIssue(issue: Issue) {
    let tempIssues = this.issuesList.getValue();
    tempIssues.push(issue);
    this.issuesList.next(tempIssues);
  }
}

describe('IssueCreateComponent', () => {
  describe('Component DOM', () => {
    let comp: IssueCreateComponent;
    let fixture: ComponentFixture<IssueCreateComponent>;
    let issuesService: IssuesService;
    let authService: AuthService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, HttpClientModule, RouterTestingModule],
        declarations: [IssueCreateComponent],
        providers: [{provide: AuthService, useClass: MockAuthService},
                    {provide: IssuesService, useClass: MockIssueService}]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(IssueCreateComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
      comp.mode="add"
    });

    it(`should create IssueCreateComponent`, () => {
      expect(comp).toBeTruthy();
    });

    it(`should render heading in h2 tag`, () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('h2').textContent).toEqual('Adding a New Issue');
    });

  it('should render Description as a label', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-label').textContent).toEqual('Description');
  });

  it('should render Severity as a label', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-label')[1].textContent).toEqual('Severity');
  });

  it('should render Status as a label', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-label')[2].textContent).toEqual('Status');
  });

  it('should render Created Date as a label', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-label')[3].textContent).toEqual('Created Date');
  });

  it('should render Resolved Date as a label', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-label')[4].textContent).toEqual('Resolved Date');
  });

  it('should render a text area to accept Issue Description', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('textarea[name="description"]')).toBeTruthy();
  });

  it('should render a dropdown list to accept Issue Severity', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-select[name="severity"]')).toBeTruthy();
  });

  it('should render a dropdown list to accept Issue Status', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('mat-select')[1]).toBeTruthy();
  });

  it('should render a Date field to accept created Date', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('input[name="createdDate"]')).toBeTruthy();
  });

  it('should render a Date field to accept resolved Date', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('input[name="resolvedDate"]')).toBeTruthy();
  });

  it('should render an Add Issue button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('button').textContent).toEqual(' Add Issue ');
  });
      });

      describe('Component class', () => {
        let comp: IssueCreateComponent;
        let fixture: ComponentFixture<IssueCreateComponent>;
        let issuesService: IssuesService;
        let authService: AuthService;

        beforeEach(async(() => {
          TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientModule, RouterTestingModule],
            providers: [IssueCreateComponent,
              {provide: AuthService, useClass: MockAuthService},
                        {provide: IssuesService, useClass: MockIssueService}]
          });
          comp = TestBed.inject(IssueCreateComponent);
          issuesService = TestBed.inject(IssuesService);
          authService = TestBed.inject(AuthService);
        }));

    it(`should have a boolean variable 'isLoading' equal to false`, () => {
      expect(comp.isLoading).toEqual(false);
    });

    it(`should have 3 severity in severities[]`, () => {
      expect(comp.severities?.length).toEqual(3);
    });

    it(`should have 3 status in statuses[]`, () => {
      expect(comp.statuses?.length).toEqual(3);
    });
  });
});

