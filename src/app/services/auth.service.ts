// src/app/services/auth.service.ts

// ✅ Importamos lo necesario desde Angular y Firebase
import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  getAuth,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';

import { app } from 'src/environments/firebase.config'; // Importamos la app de Firebase que configuramos previamente

@Injectable({
  providedIn: 'root' // Hacemos que este servicio esté disponible en toda la app
})
export class AuthService {

  // ✅ Obtenemos la instancia del módulo de autenticación de Firebase
  private auth = getAuth(app);

  constructor() {
    // ✅ Establecemos persistencia local para que Firebase recuerde la sesión
    // incluso si la app se reinicia (especialmente importante en Android)
    setPersistence(this.auth, browserLocalPersistence).catch(error => {
      console.error('❌ Error al establecer persistencia de Firebase:', error);
    });
  }

  /**
   * 🔐 Método para registrar un usuario con email y contraseña
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña segura
   * @returns Promesa con credenciales del usuario registrado
   */
  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * 🔑 Método para iniciar sesión con email y contraseña
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña
   * @returns Promesa con credenciales del usuario autenticado
   */
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * 🚪 Método para cerrar la sesión del usuario
   * @returns Promesa vacía al cerrar sesión correctamente
   */
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  /**
   * 🧾 Método opcional para obtener el usuario actual
   * @returns Objeto usuario actual si existe, null si no ha iniciado sesión
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
