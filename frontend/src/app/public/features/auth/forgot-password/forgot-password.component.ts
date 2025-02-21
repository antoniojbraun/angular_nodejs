import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  submit() {
    this.authService.ForgotPassword(this.form.value.email!).subscribe({
      next: (resp) => {
        console.log('forgot password');

        alert('An email was sent to you. Please, check for the reset email.');
        this.form.get('email')?.setValue('');
        this.form.get('email')?.markAsUntouched()
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
