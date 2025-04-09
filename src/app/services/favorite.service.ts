// Servicio: favorite.service.ts
// ✅ Guarda, elimina y consulta jugadores favoritos en Firestore por usuario autenticado.

import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app } from 'src/environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private firestore: Firestore = getFirestore(app); // 🔥 Inicializa Firestore con la app

  /**
   * ✅ Devuelve el UID del usuario autenticado
   */
  private getUserId(): string | null {
    const user = getAuth().currentUser;
    return user ? user.uid : null;
  }

  /**
   * ✅ Añade un jugador a favoritos (guardando campos seguros)
   */
  async addFavorite(player: any): Promise<void> {
    const userId = this.getUserId();
    if (!userId) {
      console.error('❌ Usuario no autenticado. No se puede añadir favorito.');
      throw new Error('Usuario no autenticado.');
    }

    if (!player?.id) {
      console.error('❌ Jugador inválido. No tiene ID.');
      throw new Error('El jugador no tiene ID.');
    }

    // 🎯 Creamos un objeto limpio con solo los datos importantes
    const jugadorParaGuardar = {
      id: player.id,
      first_name: player.first_name || '',
      last_name: player.last_name || '',
      position: player.position || '',
      team: player.team?.full_name || '',
      height: player.height || '',
      weight: player.weight || '',
      college: player.college || '',
      country: player.country || '',
      draft_year: player.draft_year || '',
      draft_round: player.draft_round || '',
      draft_number: player.draft_number || '',
      jersey_number: player.jersey_number || ''
    };

    const favRef = doc(this.firestore, `users/${userId}/favorites/${player.id}`);
    await setDoc(favRef, jugadorParaGuardar); // ✅ Guardamos datos seguros
  }

  /**
   * ✅ Elimina un jugador de favoritos por su ID
   */
  async removeFavorite(playerId: number): Promise<void> {
    const userId = this.getUserId();
    if (!userId) {
      console.error('❌ Usuario no autenticado. No se puede eliminar favorito.');
      throw new Error('Usuario no autenticado.');
    }

    const favRef = doc(this.firestore, `users/${userId}/favorites/${playerId}`);
    await deleteDoc(favRef);
  }

  /**
   * ✅ Devuelve todos los favoritos del usuario autenticado
   */
  async getFavorites(): Promise<any[]> {
    const userId = this.getUserId();
    if (!userId) {
      console.error('❌ Usuario no autenticado. No se pueden obtener favoritos.');
      throw new Error('Usuario no autenticado.');
    }

    const favCollection = collection(this.firestore, `users/${userId}/favorites`);
    const snapshot = await getDocs(favCollection);
    return snapshot.docs.map((doc) => doc.data());
  }

  /**
   * ✅ Verifica si un jugador está en la colección de favoritos
   */
  async isFavorite(playerId: number): Promise<boolean> {
    const userId = this.getUserId();
    if (!userId) {
      console.warn('⚠️ Usuario no autenticado. No se puede verificar favorito.');
      return false;
    }

    const favCollection = collection(this.firestore, `users/${userId}/favorites`);
    const q = query(favCollection, where('id', '==', playerId));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }
}
