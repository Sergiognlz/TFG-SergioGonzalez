import { IGetRanking } from '../interfaces/usecases/IGetRanking';
import { IRankingRepository } from '../interfaces/repositories/IRankingRepository';
import { Score } from '../entities/Score';

/**
 * Caso de uso: Obtener el ranking global de jugadores.
 * Responsabilidad única (SOLID - S): solo se ocupa de recuperar
 * la lista de puntuaciones ordenada para mostrarla al jugador.
 * Implementa IGetRanking siguiendo el principio de
 * Inversión de Dependencias (SOLID - D).
 */
export class GetRanking implements IGetRanking {
  /**
   * @param rankingRepository Implementación inyectada del repositorio de ranking.
   */
  constructor(private readonly rankingRepository: IRankingRepository) {}

  /**
   * Ejecuta el caso de uso: obtiene el ranking global.
   * @param limit Número máximo de entradas a devolver. Por defecto 10.
   * @returns Promise con la lista de puntuaciones ordenada descendentemente.
   */
  async execute(limit: number = 10): Promise<Score[]> {
    return await this.rankingRepository.getRanking(limit);
  }
}