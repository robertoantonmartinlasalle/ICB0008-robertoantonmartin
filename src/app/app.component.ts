import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet], 
})
export class AppComponent {
  constructor() {
    this.configurarTeclado(); // Inicializo comportamiento del teclado al arrancar la app
  }

  /*
    Configuro el comportamiento del teclado en Android para evitar errores de scroll
    cuando se abren formularios o inputs.
  */
  configurarTeclado() {
    if (Capacitor.getPlatform() === 'android') {
      Keyboard.setScroll({ isDisabled: false });
    }
  }
}
