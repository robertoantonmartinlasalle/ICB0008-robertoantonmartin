import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonicModule, ReactiveFormsModule],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    // Formulario con validación de email y contraseña
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Usuario registrado con éxito:', this.registerForm.value);
      // Aquí más adelante conectaremos con Firebase
      this.router.navigate(['/login']); // Después de registrarse, vuelve al login
    } else {
      console.log('Formulario de registro inválido');
      this.registerForm.markAllAsTouched();
    }
  }
}
