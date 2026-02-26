import { Movie } from '../../entities/Movie';

/**
 * Interfaz del caso de uso: Iniciar una nueva partida.
 * Define el contrato que debe cumplir cualquier implementación.
 */
export interface IStartGame {
  execute(): Promise<Movie>;
}