import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet], // ⬅️ Aquí está la clave para que reconozca los elementos
})
export class AppComponent {
  constructor() {
    this.configurarTeclado(); // Inicializamos comportamiento del teclado
  }

  configurarTeclado() {
    if (Capacitor.getPlatform() === 'android') {
      Keyboard.setScroll({ isDisabled: false });
    }
  }
}
