// Componente: register.page.ts
// Registro real de usuarios con Firebase Authentication

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// 🔐 Firebase Auth
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from 'src/environments/firebase.config';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
})
export class RegisterPage {
  email = '';
  password = '';
  private auth = getAuth(app);

  constructor(private router: Router) {}

  // ✅ Método de registro en Firebase
  onRegister() {
    if (!this.email || !this.password || this.password.length < 6) {
      alert('Introduce un email válido y una contraseña de al menos 6 caracteres.');
      return;
    }

    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(() => {
        alert('¡Registro exitoso! Ya puedes iniciar sesión.');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error al registrar:', error);
        alert('Error al registrar: ' + error.message);
      });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
