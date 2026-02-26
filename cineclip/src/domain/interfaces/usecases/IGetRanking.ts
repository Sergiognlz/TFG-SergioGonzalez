import { Score } from '../../entities/Score';

/**
 * Interfaz del caso de uso: Obtener el ranking global.
 */
export interface IGetRanking {
  execute(limit?: number): Promise<Score[]>;
}