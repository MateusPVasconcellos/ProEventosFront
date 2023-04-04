/* tslint:disable:no-unused-variable */
import {} from "@angular/core/testing";
import { DateTimeFormatPipe } from "./DateTimeFormat.pipe";

describe("Pipe: DateTimeFormate", () => {
    it("create an instance", () => {
        const pipe = new DateTimeFormatPipe("BR");
        expect(pipe).toBeTruthy();
    });
});
