// Componente: player-detail.page.ts
// Esta clase muestra todos los detalles de un jugador seleccionado y permite añadirlo o quitarlo de favoritos.
// El estado del favorito se sincroniza con Firestore (Firebase) y se actualiza visualmente al instante.
// Compatible con Android y navegador web.

// Importaciones principales de Angular y módulos de Ionic
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

// Importamos los servicios que desarrollamos para obtener jugadores y gestionar favoritos
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
    private route: ActivatedRoute,               // Para obtener el ID del jugador desde la ruta
    private playerService: PlayerService,        // Servicio para obtener los datos del jugador
    private favoriteService: FavoriteService,    // Servicio para comprobar, añadir y quitar favoritos
    private toastController: ToastController,    // Componente de Ionic para mostrar notificaciones tipo toast
    private cd: ChangeDetectorRef                // Se usa para forzar la detección de cambios en la vista
  ) {}

  // lo ejecuto automáticamente al cargar el componente
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Para extraer el ID del jugador desde la URL

    if (id) {
      this.cargarJugador(id); // Los datos se cargaran si existe ID válido
    } else {
      console.error('ID de jugador no proporcionado.');
      this.cargando = false;
    }
  }

  // Para obtener los datos del jugador desde la API externa y consultar si es favorito
  cargarJugador(id: number) {
    this.playerService.getPlayerById(id).subscribe({
      next: async (respuesta) => {
        // Guardamos los datos del jugador
        this.jugador = {
          ...respuesta.data,
          id: respuesta.data.id,
        };

        this.cargando = false;

        try {
          // Verificamos si el jugador ya es favorito en Firestore
          this.esFavorito = await this.favoriteService.isFavorite(this.jugador.id);
          this.cd.detectChanges(); // Forzamos a Angular a actualizar la vista en tiempo real (Me daba fallos en web)
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

  // Para marcar o desmarcar los jugadores como favoritos
  async toggleFavorito() {
    if (!this.jugador || this.actualizandoFavorito) return;

    this.actualizandoFavorito = true; 
    const estadoAnterior = this.esFavorito;
    this.esFavorito = !this.esFavorito;
    this.cd.detectChanges(); // Actualizamos la estrella visualmente en tiempo real

    try {
      if (this.esFavorito) {
        // Si lo marcamos como favorito, lo añadimos a Firestore
        await this.favoriteService.addFavorite(this.jugador);
        this.mostrarToast('Añadido a favoritos ✅');
      } else {
        // Si lo desmarcamos, lo eliminamos de Firestore
        await this.favoriteService.removeFavorite(this.jugador.id);
        this.mostrarToast('Eliminado de favoritos ❌');
      }
    } catch (error) {
      // Si algo falla, volvemos al estado anterior
      console.error('Error al actualizar favorito:', error);
      this.esFavorito = estadoAnterior;
      this.mostrarToast('Error al actualizar favorito ⚠️');
      this.cd.detectChanges(); 
    }

    this.actualizandoFavorito = false;
  }

  // Para la notificación del usuario (En la parte inferior de la pantalla)
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
