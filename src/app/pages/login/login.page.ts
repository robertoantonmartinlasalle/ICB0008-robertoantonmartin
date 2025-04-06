// Importamos los módulos necesarios desde Angular, Ionic y Angular Router
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login', // Selector para usar este componente
  standalone: true, // Declaramos que es standalone para Angular moderno
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule], // Importamos los módulos necesarios
})
export class LoginPage {
  // Variables para enlazar con ngModel
  email = '';
  password = '';

  constructor(private router: Router) {}

  // Método para verificar si las credenciales son correctas
  // Por ahora es solo una simulación fija, más adelante se conectará con Firebase
  onLogin() {
    if (this.email === 'roberto@gmail.com' && this.password === '123456') {
      this.router.navigate(['/player-list']); // Navegamos a la pantalla de jugadores si es válido
    } else {
      alert('Email o contraseña incorrectos.'); // Mostramos un aviso si falla
    }
  }

  // Navegación hacia la pantalla de registro
  irARegistro() {
    this.router.navigate(['/register']);
  }
}
