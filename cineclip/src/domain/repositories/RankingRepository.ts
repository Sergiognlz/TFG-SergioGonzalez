import { Player } from '../entities/Player';
import { Score } from '../entities/Score';

/**
 * Contrato que define las operaciones de persistencia del ranking y jugadores.
 * Siguiendo el principio de Inversión de Dependencias (SOLID - D),
 * la lógica de negocio depende de esta interfaz, nunca de Firebase directamente.
 * Si en el futuro se cambia Firebase por otra base de datos,
 * solo hay que crear una nueva implementación de esta interfaz.
 */
export interface RankingRepository {
  /**
   * Guarda o actualiza los datos de un jugador en la base de datos.
   * Si el alias no existe lo crea, si existe lo actualiza.
   * @param player Entidad Player con los datos actualizados.
   */
  savePlayer(player: Player): Promise<void>;

  /**
   * Actualiza la puntuación máxima de un jugador en el ranking global.
   * Solo actualiza si la nueva puntuación supera la registrada anteriormente.
   * @param alias Identificador del jugador.
   * @param score Puntuación obtenida en la partida recién terminada.
   */
  updateScore(alias: string, score: number): Promise<void>;

  /**
   * Obtiene el ranking global ordenado por puntuación descendente.
   * @param limit Número máximo de entradas a devolver. Por defecto 10.
   * @returns Promise con la lista de puntuaciones ordenada.
   */
  getRanking(limit?: number): Promise<Score[]>;

  /**
   * Comprueba si un alias ya existe en la base de datos.
   * Se usa al registrar un nuevo jugador para evitar duplicados.
   * @param alias Alias a comprobar.
   * @returns Promise con true si el alias ya está registrado.
   */
  aliasExists(alias: string): Promise<boolean>;
}