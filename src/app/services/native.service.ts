// Servicio: native.service.ts

import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';

@Injectable({ providedIn: 'root' })
export class NativeService {

  constructor() {}

  /*
    Abre la cámara o galería dependiendo del entorno (web o móvil).
    Uso base64 (dataUrl) porque funciona bien tanto en navegador como en Android.
    Reduzco la calidad para evitar errores o cierres inesperados.
  */
  async abrirCamara(): Promise<string | null> {
    try {
      const isWeb = !/(Android|iPhone|iPad|iPod)/i.test(navigator.userAgent);

      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: isWeb ? CameraSource.Photos : CameraSource.Prompt,
        quality: 50
      });

      return photo.dataUrl ?? null;

    } catch (error) {
      console.error('Error al usar la cámara:', error);

      if (!/(Android|iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
        alert('⚠️ No se pudo seleccionar una imagen. Usa un navegador compatible.');
      }

      return null;
    }
  }

  /*
    Método para compartir el nombre completo del jugador usando
    la API nativa o web de compartir del dispositivo.
  */
  async compartirJugador(nombreCompleto: string) {
    try {
      await Share.share({
        title: 'Jugador de la NBA',
        text: `¡Mira este jugador!¡Es un Crack! ${nombreCompleto}`,
        dialogTitle: 'Compartir jugador'
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  }
}
