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

  jugador: any = null;
  cargando = true;
  esFavorito = false;
  actualizandoFavorito = false;
  fotoJugador: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private favoriteService: FavoriteService,
    private toastController: ToastController,
    private cd: ChangeDetectorRef
  ) {}

  /*
   Al iniciar el componente obtengo el ID de la ruta
   y llamo al método que carga los datos del jugador.
  */
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.cargarJugador(id);
    } else {
      console.error('ID de jugador no proporcionado.');
      this.cargando = false;
    }
  }

  /*
   Llamo al servicio para obtener los datos del jugador desde la API externa.
   También compruebo si está en favoritos y recupero la foto temporal si existe.
  */
  cargarJugador(id: number) {
    this.playerService.getPlayerById(id).subscribe({
      next: async (respuesta) => {
        this.jugador = {
          ...respuesta.data,
          id: respuesta.data.id,
        };

        this.fotoJugador = localStorage.getItem('fotoJugador');
        localStorage.removeItem('fotoJugador');

        this.cargando = false;

        try {
          this.esFavorito = await this.favoriteService.isFavorite(this.jugador.id);
          this.cd.detectChanges();
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

  /*
   Al pulsar sobre la estrella cambio el estado de favorito.
   Si hay error, vuelvo al estado anterior y muestro un toast.
  */
  async toggleFavorito() {
    if (!this.jugador || this.actualizandoFavorito) return;

    this.actualizandoFavorito = true;
    const estadoAnterior = this.esFavorito;
    this.esFavorito = !this.esFavorito;
    this.cd.detectChanges();

    try {
      if (this.esFavorito) {
        await this.favoriteService.addFavorite(this.jugador);
        this.mostrarToast('Añadido a favoritos ✅');
      } else {
        await this.favoriteService.removeFavorite(this.jugador.id);
        this.mostrarToast('Eliminado de favoritos ❌');
      }
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      this.esFavorito = estadoAnterior;
      this.mostrarToast('Error al actualizar favorito ⚠️');
      this.cd.detectChanges();
    }

    this.actualizandoFavorito = false;
  }

  /*
   Muestro un toast con el mensaje recibido, 
   útil para confirmar acciones al usuario.
  */
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
