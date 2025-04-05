// Este componente representa la pantalla de login de la aplicación
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true, // Uso de componente standalone en Angular moderno
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule, ReactiveFormsModule], // Importamos los módulos necesarios para usar formularios reactivos
})
export class LoginPage {
  loginForm: FormGroup; // Esta propiedad almacenará los datos del formulario

  constructor(private fb: FormBuilder, private router: Router) {
    // Aquí definimos los campos del formulario y sus validaciones
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Método que se ejecuta al hacer clic en el botón de "Entrar"
  onLogin() {
    console.log('Botón LOGIN pulsado');

    if (this.loginForm.valid) {
      console.log('Login válido:', this.loginForm.value);
      // De momento solo simulamos login, más adelante se conectará con Firebase
      this.router.navigate(['/player-list']);
    } else {
      console.log('Formulario inválido');
      this.loginForm.markAllAsTouched();
    }
  }
}
