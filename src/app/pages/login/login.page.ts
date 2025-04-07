// Componente: login.page.ts
// Login real con Firebase, adaptado para funcionar correctamente en Android y navegador

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// 🔐 Firebase Auth para login
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from 'src/environments/firebase.config'; // ✅ app inicializada

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
})
export class LoginPage {
  email = '';
  password = '';
  private auth = getAuth(app); // ✅ Instancia única de Firebase Auth

  constructor(private router: Router) {}

  // ✅ Método para loguear usuarios con email/contraseña
  onLogin() {
    if (!this.email || !this.password) {
      alert('Debes introducir email y contraseña.');
      return;
    }

    // Intentamos login con Firebase Auth
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(() => {
        alert('¡Bienvenido!');
        this.router.navigate(['/player-list']);
      })
      .catch((error) => {
        console.error('Error en el login:', error);
        alert('Credenciales incorrectas o usuario no registrado.');
      });
  }

  // Redirige al registro
  irARegistro() {
    this.router.navigate(['/register']);
  }
}
