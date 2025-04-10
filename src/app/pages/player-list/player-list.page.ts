// Componente: player-list.page.ts
// Este componente muestra una lista paginada de jugadores obtenidos desde la API externa.
// También consulta Firebase para saber qué jugadores son favoritos del usuario actual.S

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

import { PlayerService } from 'src/app/services/player.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { NativeService } from 'src/app/services/native.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  templateUrl: './player-list.page.html',
  styleUrls: ['./player-list.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule],
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
    private router: Router,
    private nativeService: NativeService
  ) {}

  /*
   Al iniciar el componente cargo primero los favoritos y luego los jugadores.
   Si algo falla, detengo la carga y muestro el error por consola.
  */
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

  /*
   Cada vez que entro en la vista, actualizo la lista de favoritos
   para que esté sincronizada con Firestore.
  */
  async ionViewWillEnter() {
    this.cargando = true;
    await this.cargarFavoritos();
    this.actualizarFavoritosEnLista();
    this.cargando = false;
  }

  /*
   Llamo a Firestore para obtener la lista de jugadores favoritos
   y guardo solo los IDs para comprobarlos después.
  */
  async cargarFavoritos() {
    try {
      const favoritos = await this.favoriteService.getFavorites();
      this.favoritos = favoritos.map(fav => fav.id);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      this.favoritos = [];
    }
  }

  /*
   Llamo al servicio de la API externa para obtener los jugadores.
   Con la respuesta, marco si cada jugador es favorito y hago paginación.
  */
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

  /*
   Después de cargar jugadores, actualizo su estado de favorito
   en función de los IDs que tengo almacenados.
  */
  actualizarFavoritosEnLista() {
    this.jugadores = this.jugadores.map(jugador => ({
      ...jugador,
      esFavorito: this.favoritos.includes(jugador.id),
    }));
  }

  // Método auxiliar por si necesito comprobar favoritos manualmente
  esFavorito(id: number): boolean {
    return this.favoritos.includes(id);
  }

  // Redirige a la página de detalle del jugador seleccionado
  verDetalleJugador(id: number) {
    this.router.navigate([`/player-detail/${id}`]);
  }

  /*
   Al pulsar el botón de cámara, abro la cámara del dispositivo con NativeService.
   Si se toma la foto correctamente, la guardo en localStorage y redirijo al detalle.
  */
  async abrirCamaraJugador(jugadorId: number) {
    const imagen = await this.nativeService.abrirCamara();

    if (imagen) {
      try {
        localStorage.setItem('fotoJugador', imagen);
        console.log('Imagen guardada en localStorage');
        this.verDetalleJugador(jugadorId);
      } catch (error) {
        console.error('❌ Error al guardar imagen:', error);
        alert('⚠️ Ha ocurrido un error al guardar la imagen.');
      }
    } else {
      console.log('No se tomó ninguna foto');
    }
  }

  /*
   Al pulsar compartir, llamo al método del servicio nativo para compartir
   el nombre completo del jugador mediante la API correspondiente.
  */
  async compartirJugador(nombreCompleto: string) {
    await this.nativeService.compartirJugador(nombreCompleto);
  }
}
