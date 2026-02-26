import { Score } from '../entities/Score';
import { RankingRepository } from '../repositories/RankingRepository';

/**
 * Caso de uso: Obtener el ranking global de jugadores.
 * Responsabilidad única (SOLID - S): solo se ocupa de recuperar
 * la lista de puntuaciones ordenada para mostrarla al jugador.
 */
export class GetRanking {
  /**
   * @param rankingRepository Implementación inyectada del repositorio de ranking.
   */
  constructor(private readonly rankingRepository: RankingRepository) {}

  /**
   * Ejecuta el caso de uso: obtiene el ranking global.
   * @param limit Número máximo de entradas a devolver. Por defecto 10.
   * @returns Promise con la lista de puntuaciones ordenada descendentemente.
   */
  async execute(limit: number = 10): Promise<Score[]> {
    return await this.rankingRepository.getRanking(limit);
  }
}