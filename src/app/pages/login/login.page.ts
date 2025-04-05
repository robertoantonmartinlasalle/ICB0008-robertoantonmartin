import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // Necesario para usar *ngIf

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class LoginPage {
  loginForm: FormGroup;
  mostrarError = false;     // Controla si se debe mostrar el mensaje de error general
  mensajeError = '';        // Almacena el texto del mensaje de error a mostrar

  constructor(private fb: FormBuilder, private router: Router) {
    // Definimos los campos del formulario con sus respectivas validaciones
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],                  // Email obligatorio y con formato correcto
      password: ['', [Validators.required, Validators.minLength(6)]],       // Contraseña obligatoria y mínimo 6 caracteres
    });
  }

  // Esta función se ejecuta cuando se envía el formulario
  onLogin() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    // Si el formulario no pasa las validaciones individuales
    if (this.loginForm.invalid) {
      this.mostrarError = true;
      this.mensajeError = 'Por favor, completa todos los campos correctamente.';
      this.loginForm.markAllAsTouched(); // Marca todos los campos como "tocados" para que aparezcan los errores individuales
      return;
    }

    // Comprobamos si las credenciales son correctas
    if (email === 'roberto@gmail.com' && password === '123456') {
      this.mostrarError = false;
      this.router.navigate(['/player-list']); // Redirigimos a la lista de jugadores si el login es correcto
    } else {
      // Si el email o la contraseña son incorrectos
      this.mostrarError = true;
      this.mensajeError = 'Email o contraseña incorrectos.';
    }
  }

  // Función que determina si el email es inválido
  emailInvalido(): boolean {
    const control = this.loginForm.get('email');
    return !!control && control.invalid && (control.touched || this.mostrarError);
  }

  // Función que determina si la contraseña es inválida
  passwordInvalida(): boolean {
    const control = this.loginForm.get('password');
    return !!control && control.invalid && (control.touched || this.mostrarError);
  }
}
