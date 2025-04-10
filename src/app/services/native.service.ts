// Servicio: native.service.ts
// Este servicio encapsula el uso de funcionalidades nativas con Capacitor.
// Permite abrir la cámara (solo Android) y compartir texto (Android y web).

import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';

@Injectable({ providedIn: 'root' })
export class NativeService {

  constructor() {}

  // Método que abre la cámara y devuelve la imagen tomada
  async abrirCamara(): Promise<string | null> {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl, // Devolvemos la foto como base64
        source: CameraSource.Camera,         // Abrimos directamente la cámara
        quality: 80                           // Calidad media para rendimiento
      });

      return photo.dataUrl ?? null; // Devolvemos la imagen como string base64
    } catch (error) {
      console.error('Error al usar la cámara:', error);
      return null;
    }
  }

  // Método que permite compartir un mensaje con el sistema nativo
  async compartirJugador(nombreCompleto: string) {
    try {
      await Share.share({
        title: 'Jugador de la NBA',
        text: `¡Mira este jugador! ${nombreCompleto}`,
        dialogTitle: 'Compartir jugador'
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  }
}
