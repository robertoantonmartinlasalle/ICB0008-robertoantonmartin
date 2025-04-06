// Componente que muestra el detalle de un jugador seleccionado desde la lista
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  templateUrl: './player-detail.page.html',
  styleUrls: ['./player-detail.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class PlayerDetailPage implements OnInit {
  jugador: any = null;      // Objeto que almacena los datos del jugador
  cargando = true;          // Bandera de carga

  constructor(
    private route: ActivatedRoute,         // Usamos para obtener el parámetro ID desde la URL
    private playerService: PlayerService   // Servicio que accede a la API externa
  ) {}

  ngOnInit() {
    // Obtenemos el ID del jugador desde los parámetros de la ruta
    this.route.queryParams.subscribe((params) => {
      const id = +params['id']; // Convertimos el parámetro a número

      // Si hay ID, cargamos el jugador
      if (id) {
        this.cargarJugador(id);
      } else {
        this.cargando = false;
        console.error('ID de jugador no proporcionado.');
      }
    });
  }

  // Llama al servicio para obtener los detalles del jugador
  cargarJugador(id: number) {
    this.playerService.getPlayerById(id).subscribe({
      next: (data) => {
        this.jugador = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener los datos del jugador', error);
        this.cargando = false;
      },
    });
  }
}
