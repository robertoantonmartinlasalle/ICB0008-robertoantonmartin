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

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private favoriteService: FavoriteService,
    private toastController: ToastController,
    private cd: ChangeDetectorRef // ✅ Necesario para forzar el refresco de vista
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.cargarJugador(id);
    } else {
      console.error('ID de jugador no proporcionado.');
      this.cargando = false;
    }
  }

  cargarJugador(id: number) {
    this.playerService.getPlayerById(id).subscribe({
      next: async (respuesta) => {
        this.jugador = {
          ...respuesta.data,
          id: respuesta.data.id,
        };

        this.cargando = false;

        try {
          this.esFavorito = await this.favoriteService.isFavorite(this.jugador.id);
          this.cd.detectChanges(); // ✅ Forzamos a Angular a actualizar la vista
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

  async toggleFavorito() {
    if (!this.jugador || this.actualizandoFavorito) return;

    this.actualizandoFavorito = true;
    const estadoAnterior = this.esFavorito;
    this.esFavorito = !this.esFavorito;
    this.cd.detectChanges(); // ✅ Refrescamos inmediatamente tras cambiar

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
      this.cd.detectChanges(); // ✅ Refrescamos en caso de rollback
    }

    this.actualizandoFavorito = false;
  }

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
