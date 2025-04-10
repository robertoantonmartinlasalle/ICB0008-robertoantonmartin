import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Importo el plugin Keyboard de Capacitor para poder configurar su comportamiento
import { Keyboard } from '@capacitor/keyboard';

// Importo y registro solo los iconos que necesito (estrella rellena y vacía)
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';

// Registro los iconos personalizados que voy a usar en los componentes
addIcons({
  'star': star,
  'star-outline': starOutline,
});

// Inicio la aplicación cargando AppComponent y registrando todos los providers necesarios
bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(FormsModule, ReactiveFormsModule)
  ],
}).then(() => {
  /*
    Una vez arranca la app, configuro el scroll del teclado.
    Esto me permite evitar comportamientos erróneos al abrir inputs en móviles.
  */
  Keyboard.setScroll({ isDisabled: false });
});
