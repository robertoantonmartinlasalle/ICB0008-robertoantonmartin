// src/app/services/auth.service.ts

// Importo lo necesario desde Angular y Firebase
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

import { app } from 'src/environments/firebase.config';

@Injectable({
  providedIn: 'root' // Hago que este servicio esté disponible en toda la app
})
export class AuthService {

  // Instancia de autenticación de Firebase que reutilizo en todos los métodos
  private auth = getAuth(app);

  constructor() {
    /*
      Establezco persistencia local para que la sesión del usuario
      se mantenga aunque se reinicie la app. Esto es especialmente útil en Android.
    */
    setPersistence(this.auth, browserLocalPersistence).catch(error => {
      console.error('❌ Error al establecer persistencia de Firebase:', error);
    });
  }

  /*
    Método para registrar un nuevo usuario con email y contraseña.
    Devuelve una promesa con las credenciales del usuario registrado.
  */
  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /*
    Método para iniciar sesión con email y contraseña.
    Si las credenciales son correctas, devuelve una promesa con el usuario autenticado.
  */
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /*
    Método para cerrar sesión. Devuelve una promesa vacía si se cierra correctamente.
  */
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  /*
    Método para obtener el usuario actual si está autenticado.
    Si no hay sesión iniciada, devuelve null.
  */
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
