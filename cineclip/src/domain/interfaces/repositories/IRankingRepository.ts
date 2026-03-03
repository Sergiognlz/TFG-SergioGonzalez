import { Player } from '../../entities/Player';
import { Score } from '../../entities/Score';

/**
 * Contrato que define las operaciones de persistencia del ranking y jugadores.
 * Siguiendo el principio de Inversión de Dependencias (SOLID - D),
 * la lógica de negocio depende de esta interfaz, nunca de Firebase directamente.
 * Si en el futuro se cambia Firebase por otra base de datos,
 * solo hay que crear una nueva implementación de esta interfaz.
 */
export interface IRankingRepository {
  /** Guarda o actualiza los datos de un jugador en la base de datos. */
  savePlayer(player: Player): Promise<void>;

  /**
   * Actualiza la puntuación máxima de un jugador en el ranking global.
   * Solo actualiza si la nueva puntuación supera la registrada anteriormente.
   * @param alias Identificador del jugador.
   * @param score Puntuación obtenida en la partida recién terminada.
   */
  updateScore(alias: string, score: number): Promise<void>;

  /** Obtiene el ranking global ordenado por puntuación descendente. */
  getRanking(limit?: number): Promise<Score[]>;

  /** Comprueba si un alias ya existe en la base de datos. */
  aliasExists(alias: string): Promise<boolean>;
}