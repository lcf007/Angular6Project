import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators, AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employeeForm: FormGroup;

  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    'fullName': '',
    'email': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domain should be gmail.com'
    },
    'phone': {
      'required': 'Phone is required.'
    },
    'skillName': {
      'required': 'Skill Name is required.',
    },
    'experienceInYears': {
      'required': 'Experience is required.',
    },
    'proficiency': {
      'required': 'Proficiency is required.',
    },
  };

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      email: ['', [Validators.required, emailDomain]],
      phone: ['',],
      skills: this.fb.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required],
      })
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) =>
      this.onContactPreferenceChange(data)
    );
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach(key => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorkey in abstractControl.errors) {
            if (errorkey) {
              this.formErrors[key] += messages[errorkey] + ' ';
            }
          }
        }
      }
    });
  }

  onContactPreferenceChange(type: string): void {
    if (type === 'phone') {
      this.employeeForm.get('phone').setValidators(Validators.required);
      this.employeeForm.get('email').clearValidators();
    } else {
      this.employeeForm.get('email').setValidators(Validators.required);
      this.employeeForm.get('phone').clearValidators();
    }
    this.employeeForm.get('phone').updateValueAndValidity();
    this.employeeForm.get('email').updateValueAndValidity();
  }

  onSubmit(): void {
    console.log(this.employeeForm);
  }

  onLoadData(): void {
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }
}

function emailDomain( control: AbstractControl): {[key: string]: any} | null {
  const email: string = control.value;
  const domain = email.substring(email.lastIndexOf('@')+1);
  console.log(domain);
  if ( email === '' || domain.toLowerCase() === 'gmail.com'){
    return null;
  } else {
    return {'emailDomain': true};
  }
}
