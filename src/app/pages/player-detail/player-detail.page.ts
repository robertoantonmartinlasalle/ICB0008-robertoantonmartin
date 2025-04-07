// Componente que muestra el detalle de un jugador usando su ID en la URL
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
  jugador: any = null;     // Almacena el jugador obtenido
  cargando = true;         // Indicador de carga

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService
  ) {}

  ngOnInit() {
    // ✅ Obtenemos el ID desde la URL /player-detail/:id
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.cargarJugador(id);
    } else {
      this.cargando = false;
      console.error('ID de jugador no proporcionado.');
    }
  }

  cargarJugador(id: number) {
    this.playerService.getPlayerById(id).subscribe({
      next: (respuesta) => {
        // ✅ Asignamos directamente el objeto jugador desde "data"
        this.jugador = respuesta.data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener los datos del jugador', error);
        this.cargando = false;
      },
    });
  }
}
