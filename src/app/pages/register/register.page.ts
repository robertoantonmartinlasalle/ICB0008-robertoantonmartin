import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class RegisterPage {
  registerForm: FormGroup;
  mostrarError = false;
  mensajeError = '';

  constructor(private fb: FormBuilder, private router: Router) {
    // Creamos el formulario con validación
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Método que se ejecuta al pulsar "Registrarse"
  onRegister() {
    if (this.registerForm.valid) {
      // Si es válido, redirigimos al login y enviamos un estado indicando éxito
      this.mostrarError = false;
      this.router.navigate(['/login'], {
        state: { registroExitoso: true }
      });
    } else {
      // Mostramos mensaje de error general si hay fallos
      this.mostrarError = true;
      this.mensajeError = 'Por favor, completa todos los campos correctamente.';
      this.registerForm.markAllAsTouched();
    }
  }

  // Método para navegar al login desde el botón "¿Ya tienes cuenta?"
  irALogin() {
    this.router.navigate(['/login']);
  }
}
