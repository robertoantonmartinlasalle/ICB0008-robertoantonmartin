import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

import { PlayerService } from 'src/app/services/player.service';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  templateUrl: './player-list.page.html',
  styleUrls: ['./player-list.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
  ],
})
export class PlayerListPage implements OnInit {

  jugadores: any[] = [];
  cargando = false;
  siguienteCursor: string = '';
  hayMas = true;
  favoritos: number[] = [];

  constructor(
    private playerService: PlayerService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.cargando = true;

    try {
      await this.cargarFavoritos();
      this.cargarJugadores();
    } catch (error) {
      console.error('Error en ngOnInit:', error);
      this.cargando = false;
    }
  }

  // ✅ Se ejecuta cada vez que se entra en la vista (al volver del detalle)
  async ionViewWillEnter() {
    this.cargando = true;
    await this.cargarFavoritos();
    this.actualizarFavoritosEnLista();
    this.cargando = false;
  }

  async cargarFavoritos() {
    try {
      const favoritos = await this.favoriteService.getFavorites();
      this.favoritos = favoritos.map(fav => fav.id);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      this.favoritos = [];
    }
  }

  cargarJugadores() {
    this.playerService.getPlayers(this.siguienteCursor).subscribe({
      next: (respuesta) => {
        const jugadoresConFavorito = respuesta.data.map((jugador: any) => ({
          ...jugador,
          esFavorito: this.favoritos.includes(jugador.id),
        }));

        this.jugadores = [...this.jugadores, ...jugadoresConFavorito];
        this.siguienteCursor = respuesta.meta?.next_cursor || '';
        this.hayMas = !!this.siguienteCursor;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener jugadores', err);
        this.cargando = false;
      }
    });
  }

  // ✅ Refrescar la propiedad esFavorito de los jugadores ya cargados
  actualizarFavoritosEnLista() {
    this.jugadores = this.jugadores.map(jugador => ({
      ...jugador,
      esFavorito: this.favoritos.includes(jugador.id),
    }));
  }

  esFavorito(id: number): boolean {
    return this.favoritos.includes(id);
  }

  verDetalleJugador(id: number) {
    this.router.navigate([`/player-detail/${id}`]);
  }
}
