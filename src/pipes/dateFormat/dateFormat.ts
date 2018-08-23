import { Pipe, PipeTransform } from "@angular/core";
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | dataFormat:exponent
 * Example:
 *   {{ 2 | dataFormat:10 }}
 *   formats to: 1024
*/
@Pipe({ name: "dateFormat" })
export class DateFormatPipe implements PipeTransform {
    transform(value: string, exponent?: string): string {
        return new Date(parseInt(value) * 1000).toLocaleString().replace(/:\d{1,2}$/, " ");
    }
}
