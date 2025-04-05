// Importamos las herramientas necesarias desde Angular e Ionic
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
import { CommonModule, Location } from '@angular/common'; // Para poder leer el estado de navegación
import { ViewWillEnter } from '@ionic/angular'; // Hook de ciclo de vida propio de Ionic

@Component({
  selector: 'app-login',
  standalone: true, // Declaramos que este componente es independiente
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule], // Módulos necesarios para formularios y *ngIf
})
export class LoginPage implements ViewWillEnter {
  // Creamos el formulario de login
  loginForm: FormGroup;

  // Variables para controlar errores y mensajes en la vista
  mostrarError = false;
  mensajeError = '';
  registroExitoso = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location // Usamos Location para acceder al history.state
  ) {
    // Inicializamos el formulario con validaciones:
    // - Email requerido y con formato válido
    // - Contraseña requerida, mínimo 6 caracteres
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Este método de Ionic se ejecuta cada vez que se entra en la página
  ionViewWillEnter(): void {
    // Obtenemos el estado de navegación usando Location
    const state = this.location.getState() as { registroExitoso?: boolean };

    // Si el usuario viene del registro con éxito, mostramos mensaje
    if (state?.registroExitoso) {
      this.registroExitoso = true;

      // Eliminamos el estado del navegador para que no se repita al refrescar
      history.replaceState({}, '', window.location.pathname);
    } else {
      this.registroExitoso = false;
    }
  }

  // Función que se ejecuta al hacer submit en el formulario
  onLogin() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    // Validamos el formulario
    if (this.loginForm.invalid) {
      this.mostrarError = true;
      this.mensajeError = 'Por favor, completa todos los campos correctamente.';
      this.loginForm.markAllAsTouched(); // Fuerza la visualización de errores individuales
      return;
    }

    // Simulamos un login con credenciales fijas (más adelante se conectará a Firebase)
    if (email === 'roberto@gmail.com' && password === '123456') {
      this.mostrarError = false;
      this.router.navigate(['/player-list']); // Navegamos a la lista de jugadores
    } else {
      this.mostrarError = true;
      this.mensajeError = 'Email o contraseña incorrectos.';
    }
  }

  // Método que indica si el email está mal introducido
  emailInvalido(): boolean {
    const control = this.loginForm.get('email');
    return !!control && control.invalid && (control.touched || this.mostrarError);
  }

  // Método que indica si la contraseña no cumple con las condiciones
  passwordInvalida(): boolean {
    const control = this.loginForm.get('password');
    return !!control && control.invalid && (control.touched || this.mostrarError);
  }

  // Método que navega a la pantalla de registro
  irARegistro() {
    this.router.navigate(['/register']);
  }
}
