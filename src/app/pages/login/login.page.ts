// Componente: login.page.ts
// Login real con Firebase, adaptado para funcionar correctamente en Android y navegador

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Firebase Auth para login
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from 'src/environments/firebase.config'; // app inicializada

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

  /* 
   Inicializo la instancia de autenticación de Firebase.
   Esta instancia se usará para realizar el login con email y contraseña.
  */
  private auth = getAuth(app);

  constructor(private router: Router) {}

  /*
   Método que se ejecuta al hacer login.
   Comprueba que los campos estén completos y luego hace login con Firebase.
   Si es correcto, redirige a la lista de jugadores.
  */
  onLogin() {
    if (!this.email || !this.password) {
      alert('Debes introducir email y contraseña.');
      return;
    }

    // Intento iniciar sesión con Firebase Auth
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

  /*
   Método que me lleva a la pantalla de registro si el usuario no tiene cuenta.
  */
  irARegistro() {
    this.router.navigate(['/register']);
  }
}
