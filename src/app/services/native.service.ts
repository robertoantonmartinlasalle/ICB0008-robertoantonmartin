// Servicio: native.service.ts
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';

@Injectable({ providedIn: 'root' })
export class NativeService {

  constructor() {}

  // ✅ Esta versión cumple exactamente lo que pediste
  async abrirCamara(): Promise<string | null> {
    try {
      const isWeb = !/(Android|iPhone|iPad|iPod)/i.test(navigator.userAgent);

      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl, // base64 para mostrar directamente
        source: isWeb ? CameraSource.Photos : CameraSource.Prompt, // 🎯 Web solo galería, móvil galería o cámara
        quality: 50 // calidad media para evitar errores en Android
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
