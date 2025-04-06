// Componente de registro adaptado al mismo estilo que login
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register', // Nombre del selector del componente
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
})
export class RegisterPage {
  // Variables para ngModel
  email = '';
  password = '';

  constructor(private router: Router) {}

  // Simulamos validación y redirección tras el registro
  onRegister() {
    if (!this.email || !this.password || this.password.length < 6) {
      alert('Introduce un email válido y una contraseña de al menos 6 caracteres.');
      return;
    }

    alert('¡Registro exitoso! Ya puedes iniciar sesión.');
    this.router.navigate(['/login']);
  }

  // Navegación al login
  irALogin() {
    this.router.navigate(['/login']);
  }
}
