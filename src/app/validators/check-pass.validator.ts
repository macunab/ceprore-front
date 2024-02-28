import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { AuthService } from "../auth/services/auth.service";
import { map, switchMap, timer } from "rxjs";


export function checkPassValidator(
    authService: AuthService
): AsyncValidatorFn {
    return (control: AbstractControl) => {
                return timer(500).pipe(
                    switchMap(() =>
                        authService.checkPass(authService.user.email, control.value)
                        .pipe(map((result) => !result ? {asyncInvalid: true} : null)))
                );
    }
}