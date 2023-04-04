import { FormControl } from "@angular/forms";

export class CssValidatorService {
    public Validator(campoForm: FormControl): any {
        return { "is-invalid": campoForm.errors && campoForm.touched };
    }
    public ValidatorError(campoForm: FormControl, error: string): any {
        return campoForm.hasError(`${error}`);
    }
}
