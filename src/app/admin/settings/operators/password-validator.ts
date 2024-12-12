import { FormControl } from '@angular/forms';

export function passwordValidator(
  control: FormControl
): { [key: string]: boolean } {
  // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\.])[A-Za-z\d$@!%*?&_\.]{4,15}$/
  const passwordRegexp: RegExp = /^[a-zA-Z0-9@$!%*?&_]{6,15}$/;
  if (control.value && !passwordRegexp.test(control.value)) {
    return { invalidPassword: true };
  }
}

