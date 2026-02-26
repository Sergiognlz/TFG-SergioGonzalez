import { ISaveSessionScore } from '../interfaces/usecases/ISaveSessionScore';
import { IRankingRepository } from '../interfaces/repositories/IRankingRepository';

/**
 * Caso de uso: Guardar la puntuación total de una sesión en el ranking.
 * Se ejecuta únicamente cuando el jugador hace game over,
 * guardando la puntuación acumulada de todas las películas acertadas.
 * Responsabilidad única (SOLID - S): solo se ocupa de persistir
 * la puntuación final de la sesión, separando esta responsabilidad
 * de SubmitAnswer que solo valida respuestas.
 * Implementa ISaveSessionScore siguiendo el principio de
 * Inversión de Dependencias (SOLID - D).
 */
export class SaveSessionScore implements ISaveSessionScore {
  /**
   * @param rankingRepository Repositorio de ranking para persistir la puntuación.
   */
  constructor(private readonly rankingRepository: IRankingRepository) {}

  /**
   * Ejecuta el caso de uso: guarda la puntuación si supera el máximo anterior.
   * Solo persiste si la puntuación es mayor que 0 para evitar
   * entradas vacías en el ranking.
   * @param alias Alias del jugador.
   * @param totalScore Puntuación total acumulada en la sesión.
   */
  async execute(alias: string, totalScore: number): Promise<void> {
    if (totalScore > 0) {
      await this.rankingRepository.updateScore(alias, totalScore);
    }
  }
}