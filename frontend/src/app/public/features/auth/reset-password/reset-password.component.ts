import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// Confirm password validator
function matchPassword(): ValidatorFn {
  return (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password === confirmPassword) return null;
    return { mismatch: true };
  };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  token = '';
  routeParams = inject(ActivatedRoute);
  router = inject(Router);
  constructor() {
    this.routeParams.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  passwordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9](?=.*[W_])+$';
  form = this.fb.group(
    {
      password: [
        '',
        [
          // Validators.required,
          Validators.minLength(6),
          // Password must contain at least one lowercase, one uppercase, one number and one special character.
          Validators.pattern(/[A-Za-z\d\W_]/),
          Validators.pattern(/(?=.*[a-z])/), // Pelo menos uma letra minúscula
          Validators.pattern(/(?=.*[A-Z])/), // Pelo menos uma letra maiúscula
          Validators.pattern(/(?=.*\d)/), // Pelo menos um número
          Validators.pattern(/(?=.*[\W_])/), // Pelo menos um caractere especial
        ],
      ],
      confirmPassword: [
        '',
        [
          // Validators.required,
          Validators.minLength(6),
          // Password must contain at least one lowercase, one uppercase, one number and one special character.
          Validators.pattern(/[A-Za-z\d\W_]/),
          Validators.pattern(/(?=.*[a-z])/), // Pelo menos uma letra minúscula
          Validators.pattern(/(?=.*[A-Z])/), // Pelo menos uma letra maiúscula
          Validators.pattern(/(?=.*\d)/), // Pelo menos um número
          Validators.pattern(/(?=.*[\W_])/), // Pelo menos um caractere especial
        ],
      ],
    },
    {
      validators: matchPassword(),
    }
  );

  submit() {
    this.authService
      .resetPassword({
        token: this.token,
        password: this.form.value.password!,
      })
      .subscribe({
        next: () => {
          alert('Password updated successfully');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          if (err && err.error && err.error.message) {
            alert(err.error.message);
          }
          console.log(err);
        },
      });
  }
}
