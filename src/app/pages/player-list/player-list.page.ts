// Componente: player-list.page.ts
// Este componente muestra una lista paginada de jugadores obtenidos desde la API externa.
// También consulta Firebase para saber qué jugadores son favoritos del usuario actual.
// He incorporado funcionalidades de cámara y compartir, y optimizado la gestión de imágenes
// para evitar fallos al usar dispositivos Android. Además, los botones se sitúan junto al
// nombre de cada jugador porque me parece más lógico visual y funcionalmente.

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

  jugadores: any[] = [];             // Lista de jugadores obtenidos desde la API externa
  cargando = false;                  // Spinner de carga
  siguienteCursor: string = '';     // Cursor para la paginación de la API externa
  hayMas = true;                    // Si hay más resultados disponibles
  favoritos: number[] = [];         // IDs de jugadores marcados como favoritos

  constructor(
    private playerService: PlayerService,
    private favoriteService: FavoriteService,
    private router: Router,
    private nativeService: NativeService
  ) {}

  // 🚀 Al iniciar el componente, primero cargamos los favoritos y luego los jugadores
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

  // 🔄 Cada vez que se entra en la vista (al volver del detalle), actualizamos los favoritos
  async ionViewWillEnter() {
    this.cargando = true;
    await this.cargarFavoritos();
    this.actualizarFavoritosEnLista();
    this.cargando = false;
  }

  // 🔁 Llama a Firestore y obtiene la lista de jugadores favoritos del usuario actual
  async cargarFavoritos() {
    try {
      const favoritos = await this.favoriteService.getFavorites();
      this.favoritos = favoritos.map(fav => fav.id); // Solo almacenamos los IDs
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      this.favoritos = [];
    }
  }

  // 📡 Carga los jugadores desde la API externa con paginación
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

  // 🔄 Actualiza la propiedad esFavorito de los jugadores ya cargados en memoria
  actualizarFavoritosEnLista() {
    this.jugadores = this.jugadores.map(jugador => ({
      ...jugador,
      esFavorito: this.favoritos.includes(jugador.id),
    }));
  }

  // ✅ Método auxiliar para saber si un jugador es favorito (no usado en plantilla)
  esFavorito(id: number): boolean {
    return this.favoritos.includes(id);
  }

  // 🧭 Navega al detalle del jugador seleccionado
  verDetalleJugador(id: number) {
    this.router.navigate([`/player-detail/${id}`]);
  }

  // 📸 Al pulsar el botón cámara, abrimos la cámara del dispositivo y tratamos la imagen de forma segura.
  // ✅ La imagen se guarda en localStorage (base64), ya no aplicamos límites fijos.
  async abrirCamaraJugador(jugadorId: number) {
    const imagen = await this.nativeService.abrirCamara();

    if (imagen) {
      try {
        localStorage.setItem('fotoJugador', imagen); // ✅ Guardamos directamente
        console.log('Imagen guardada en localStorage');
        this.verDetalleJugador(jugadorId); // ✅ Navegamos al detalle del jugador
      } catch (error) {
        console.error('❌ Error al guardar imagen:', error);
        alert('⚠️ Ha ocurrido un error al guardar la imagen.');
      }
    } else {
      console.log('No se tomó ninguna foto');
    }
  }

  // 📤 Al pulsar el botón compartir, se activa la API nativa para compartir el nombre del jugador
  async compartirJugador(nombreCompleto: string) {
    await this.nativeService.compartirJugador(nombreCompleto);
  }
}
