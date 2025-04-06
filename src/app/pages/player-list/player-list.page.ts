import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PlayerService } from 'src/app/services/player.service';
import { RouterModule, Router } from '@angular/router';

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
  siguienteCursor: string = ''; // Cursor actual para la paginación
  hayMas = true;

  constructor(
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarJugadores(); // Cargamos la primera tanda
  }

  cargarJugadores() {
    this.cargando = true;

    this.playerService.getPlayers(this.siguienteCursor).subscribe({
      next: (respuesta) => {
        this.jugadores = [...this.jugadores, ...respuesta.data];
        this.siguienteCursor = respuesta.meta?.next_cursor || '';

        // Si no hay cursor para la siguiente, desactivamos el botón
        this.hayMas = !!this.siguienteCursor;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener jugadores', err);
        this.cargando = false;
      }
    });
  }

  verDetalleJugador(id: number) {
    this.router.navigate(['/player-detail'], {
      queryParams: { id }
    });
  }
}
