import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import { Constants } from "@app/utils/Constants";

@Pipe({
    name: "DateTimeFormat",
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        const month = value.substring(0, 2);
        const day = value.substring(3, 5);
        const year = value.substring(6, 10);
        const hour = value.substring(11, 13);
        const minutes = value.substring(14, 16);
        value = day + "/" + month + "/" + year + " " + hour + ":" + minutes;
        return super.transform(value, Constants.DATE_TIME_FMT);
    }
}
