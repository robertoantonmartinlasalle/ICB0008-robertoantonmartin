import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 🟢 Importamos Keyboard desde Capacitor
import { Keyboard } from '@capacitor/keyboard';

// 🟢 Lanzamos la app con providers
bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(FormsModule, ReactiveFormsModule)
  ],
}).then(() => {
  // ✅ Configuramos el comportamiento del teclado solo en dispositivos compatibles
  Keyboard.setScroll({ isDisabled: false });
});
