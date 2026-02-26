import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../../infrastructure/config/firebaseConfig';
import { Player } from '../../domain/entities/Player';
import { Score } from '../../domain/entities/Score';
import { RankingRepository } from '../../domain/repositories/RankingRepository';

/**
 * Implementación concreta de RankingRepository usando Firebase Firestore.
 * Siguiendo el principio de Inversión de Dependencias (SOLID - D),
 * la lógica de negocio nunca importa esta clase directamente,
 * sino la interfaz RankingRepository.
 * 
 * Colecciones de Firestore utilizadas:
 * - /jugadores/{alias} → datos del jugador
 * - /ranking/{alias}   → puntuación máxima para el ranking global
 */
export class FirebaseRankingRepository implements RankingRepository {

  /**
   * Guarda o actualiza los datos de un jugador en Firestore.
   * Si el documento no existe lo crea, si existe lo sobreescribe.
   * @param player Entidad Player con los datos actualizados.
   */
  async savePlayer(player: Player): Promise<void> {
    const playerRef = doc(db, 'jugadores', player.alias);
    await setDoc(playerRef, {
      alias: player.alias,
      puntuacion_total: player.totalScore,
      partidas_jugadas: player.gamesPlayed,
      fecha_registro: player.registeredAt,
      ultima_partida: player.lastGameAt,
    });
  }

  /**
   * Actualiza la puntuación máxima del jugador en el ranking global.
   * Solo actualiza si la nueva puntuación supera la registrada anteriormente.
   * @param alias Identificador del jugador.
   * @param score Puntuación obtenida en la partida recién terminada.
   */
  async updateScore(alias: string, score: number): Promise<void> {
    const rankingRef = doc(db, 'ranking', alias);
    const snapshot = await getDoc(rankingRef);

    if (!snapshot.exists()) {
      // Primera puntuación del jugador: crear el documento
      await setDoc(rankingRef, {
        alias_jugador: alias,
        puntuacion_maxima: score,
        fecha_actualizacion: new Date(),
      });
    } else {
      // Solo actualizar si la nueva puntuación supera la anterior
      const current = snapshot.data().puntuacion_maxima ?? 0;
      if (score > current) {
        await updateDoc(rankingRef, {
          puntuacion_maxima: score,
          fecha_actualizacion: new Date(),
        });
      }
    }
  }

  /**
   * Obtiene el ranking global ordenado por puntuación descendente.
   * @param limit Número máximo de entradas a devolver. Por defecto 10.
   * @returns Promise con la lista de puntuaciones ordenada.
   */
  async getRanking(limitCount: number = 10): Promise<Score[]> {
    const rankingRef = collection(db, 'ranking');
    const q = query(
      rankingRef,
      orderBy('puntuacion_maxima', 'desc'),
      limit(limitCount),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      alias: doc.data().alias_jugador,
      maxScore: doc.data().puntuacion_maxima,
      updatedAt: doc.data().fecha_actualizacion?.toDate() ?? new Date(),
    }));
  }

  /**
   * Comprueba si un alias ya existe en la colección de jugadores.
   * @param alias Alias a comprobar.
   * @returns Promise con true si el alias ya está registrado.
   */
  async aliasExists(alias: string): Promise<boolean> {
    const playerRef = doc(db, 'jugadores', alias);
    const snapshot = await getDoc(playerRef);
    return snapshot.exists();
  }
}