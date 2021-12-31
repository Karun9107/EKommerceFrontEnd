import { FormControl, ValidationErrors } from "@angular/forms";

export class EkommerceValidator {

    static notOnlyWhiteSpace(formControl : FormControl) : ValidationErrors | null{
        if(formControl.value == null || formControl.value.trim().length === 0) {
            return {'notOnlyWhiteSpace' : true}
        }

        return null;
    }
}
