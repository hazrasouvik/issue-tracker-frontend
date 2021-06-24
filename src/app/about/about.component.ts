import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    loop = [0, 1, 2, 3, 4, 5];
    cardHeaders: string[] =["List","Detail","Add","Update","Delete","Analysis"];
    cardContents: string[] =["Dispalys the list of issues being tracked. Provision is provided to customize which fields can be displayed. There is also an option to navigate from this page to add a issue or select a issue to update or delete",
  "Complete Issue Details for a particualr Issue can be viewed on Clicking that Issue Number Head",
"A new Issue can be added by providing all the required information. The issue description, severity, status and created date are the required information to create an issue. The resolved date will be as per the status of the new issue",
"When the list of issues are displayed, one issue can be selected to update at a time. The issue description, severity, status, created date and resolved date can be allowed to be updated",
"When the list of issues are displayed, one or more issues can be selected to delete at a time",
" Issue Analysis can be done for the Top Viewed Issues by clicking the Issue Analytics button on the Issues List page. Various Charts are provided to display the top viewed issues. The total number of Top Viewed Issues can be customized"
]

    constructor() {}

    ngOnInit() {}
}
