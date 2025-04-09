// Componente: player-list.page.ts
// Esta clase muestra una lista paginada de jugadores obtenidos desde la API externa.
// Además, consulta Firebase para identificar cuáles de ellos están marcados como favoritos
// y actualiza la lista en tiempo real al volver del detalle de jugador.

// Importaciones principales de Angular y módulos de Ionic
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

// Importamos los servicios que desarrollamos para obtener jugadores y gestionar favoritos
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

  jugadores: any[] = [];            // Lista  de jugadores obtenidos desde la API
  cargando = false;                
  siguienteCursor: string = '';    
  hayMas = true;                   // Si hay más jugadores que cargar añado paginación
  favoritos: number[] = [];        // Lista de IDs de jugadores favoritos guardados en Firebase

  constructor(
    private playerService: PlayerService,         
    private favoriteService: FavoriteService,     
    private router: Router                        
  ) {}

  // Método que se ejecuta al iniciar el componente
  async ngOnInit() {
    this.cargando = true;

    try {
      // Primero cargamos los favoritos desde Firebase
      await this.cargarFavoritos();

      // Luego cargamos los jugadores con la primera página
      this.cargarJugadores();
    } catch (error) {
      console.error('Error en ngOnInit:', error);
      this.cargando = false;
    }
  }

  // 
  // Para resolver el problema de actualizar los favoritos después de haber modificado uno desde el detalle
  async ionViewWillEnter() {
    this.cargando = true;

    // Se vuelve a cargar la lista de favoritos desde Firestore
    await this.cargarFavoritos();

    // Refrescamos la propiedad esFavorito en los jugadores que ya se habían cargado
    this.actualizarFavoritosEnLista();

    this.cargando = false;
  }

  // Este método obtiene todos los jugadores marcados como favoritos por el usuario actual
  async cargarFavoritos() {
    try {
      const favoritos = await this.favoriteService.getFavorites();
      // Solo almacenamos los IDs para luego comparar
      this.favoritos = favoritos.map(fav => fav.id);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      this.favoritos = [];
    }
  }

  // Método que obtiene jugadores paginados desde la API externa
  cargarJugadores() {
    this.playerService.getPlayers(this.siguienteCursor).subscribe({
      next: (respuesta) => {
        // A cada jugador le añadimos la propiedad "esFavorito"
        const jugadoresConFavorito = respuesta.data.map((jugador: any) => ({
          ...jugador,
          esFavorito: this.favoritos.includes(jugador.id),
        }));

        // Añadimos los nuevos jugadores a los que ya se habían cargado (paginación acumulativa)
        this.jugadores = [...this.jugadores, ...jugadoresConFavorito];

        // Actualizamos el cursor y el estado de paginación
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

  // Este método recorre la lista de jugadores ya cargados
  // y actualiza la propiedad esFavorito para reflejar los cambios realizados en otra pantalla
  actualizarFavoritosEnLista() {
    this.jugadores = this.jugadores.map(jugador => ({
      ...jugador,
      esFavorito: this.favoritos.includes(jugador.id),
    }));
  }

  // Método que comprueba si un jugador es favorito. Actualmente no se usa en plantilla,
  
  esFavorito(id: number): boolean {
    return this.favoritos.includes(id);
  }

  // Para la navegación a la página de los detalles del jugador
  verDetalleJugador(id: number) {
    this.router.navigate([`/player-detail/${id}`]);
  }
}
