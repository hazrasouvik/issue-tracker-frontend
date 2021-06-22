import { Pipe, PipeTransform } from "@angular/core";
import { Issue } from "./issues/issue.model";

@Pipe({name: 'searchFilter'})
export class SearchFilterPipe implements PipeTransform {

  transform(value: Issue[], args: string): any[] {
    let searchFilter: string = args?.toLocaleLowerCase();
    return searchFilter?value.filter(eachValue =>
      eachValue.description.toLocaleLowerCase().includes(searchFilter)!= false):value;
  }
}
