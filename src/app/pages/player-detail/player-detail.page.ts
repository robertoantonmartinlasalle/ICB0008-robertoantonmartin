// Componente: player-detail.page.ts
// Este componente se encarga de mostrar los detalles de un jugador concreto seleccionado desde la lista.
// También permite marcar al jugador como favorito (guardado en Firebase).
// Además, muestra una fotografía tomada desde la cámara si ha sido capturada, 
// evitando errores en Android (pantalla blanca o reinicio) usando URI en lugar de base64.

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

import { PlayerService } from 'src/app/services/player.service';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  templateUrl: './player-detail.page.html',
  styleUrls: ['./player-detail.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule],
})
export class PlayerDetailPage implements OnInit {

  jugador: any = null;                // Objeto con los datos del jugador
  cargando = true;                    // Indicador de carga mientras se obtiene la info desde la API
  esFavorito = false;                // Indica si el jugador está marcado como favorito
  actualizandoFavorito = false;      // Flag para evitar múltiples clics rápidos sobre la estrella
  fotoJugador: string | null = null; // Imagen tomada desde cámara, recibida como URI

  constructor(
    private route: ActivatedRoute,                // Para acceder al parámetro de la ruta (id del jugador)
    private playerService: PlayerService,         // Servicio que obtiene datos del jugador desde la API externa
    private favoriteService: FavoriteService,     // Servicio que gestiona los favoritos en Firebase
    private toastController: ToastController,     // Componente para mostrar mensajes tipo toast
    private cd: ChangeDetectorRef                 // Para forzar la detección de cambios visuales
  ) {}

  // 🚀 Al iniciar el componente obtenemos el ID desde la ruta y cargamos los datos
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.cargarJugador(id);
    } else {
      console.error('ID de jugador no proporcionado.');
      this.cargando = false;
    }
  }

  // 📡 Obtenemos los datos del jugador desde la API externa
  cargarJugador(id: number) {
    this.playerService.getPlayerById(id).subscribe({
      next: async (respuesta) => {
        this.jugador = {
          ...respuesta.data,
          id: respuesta.data.id, // Aseguramos que tenga campo id por seguridad
        };

        // ✅ Recuperamos la URI de la imagen desde localStorage (si fue tomada previamente)
        this.fotoJugador = localStorage.getItem('fotoJugador');
        localStorage.removeItem('fotoJugador'); // Eliminamos la URI tras usarla

        this.cargando = false;

        try {
          // 🔁 Comprobamos si el jugador está marcado como favorito en Firestore
          this.esFavorito = await this.favoriteService.isFavorite(this.jugador.id);
          this.cd.detectChanges(); // Actualizamos la vista si es necesario
        } catch (error) {
          console.error('Error al comprobar favorito:', error);
        }
      },
      error: (error) => {
        console.error('Error al obtener jugador:', error);
        this.cargando = false;
      },
    });
  }

  // ⭐ Al pulsar sobre la estrella cambiamos el estado de favorito
  async toggleFavorito() {
    if (!this.jugador || this.actualizandoFavorito) return;

    this.actualizandoFavorito = true;
    const estadoAnterior = this.esFavorito;
    this.esFavorito = !this.esFavorito;
    this.cd.detectChanges(); // Refrescar vista inmediatamente

    try {
      if (this.esFavorito) {
        await this.favoriteService.addFavorite(this.jugador); // Añadimos a favoritos en Firestore
        this.mostrarToast('Añadido a favoritos ✅');
      } else {
        await this.favoriteService.removeFavorite(this.jugador.id); // Eliminamos de favoritos
        this.mostrarToast('Eliminado de favoritos ❌');
      }
    } catch (error) {
      // Si ocurre un error, volvemos al estado anterior
      console.error('Error al actualizar favorito:', error);
      this.esFavorito = estadoAnterior;
      this.mostrarToast('Error al actualizar favorito ⚠️');
      this.cd.detectChanges(); // Volvemos a mostrar el estado anterior en la UI
    }

    this.actualizandoFavorito = false;
  }

  // 🍞 Método para mostrar un mensaje tipo toast en la parte inferior de la pantalla
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
  }
}
