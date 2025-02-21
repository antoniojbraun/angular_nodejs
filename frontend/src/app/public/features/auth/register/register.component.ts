import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

// ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9](?=.*[\W_])+$
// ^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[W_])[A-Za-zdW_]{6,}$

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  passwordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9](?=.*[W_])+$';
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
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
  });

  submit() {
    this.authService
      .register({
        name: this.form.value.name!,
        email: this.form.value.email!,
        password: this.form.value.password!,
      })
      .subscribe({
        next: (res) => {
          console.log('Register successfully');
        },
        error: (err) => {
          console.error('Register failed' + JSON.parse(err));
        },
      });
  }
}
