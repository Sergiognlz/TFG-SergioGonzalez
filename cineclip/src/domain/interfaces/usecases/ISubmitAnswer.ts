import { AnswerResult } from '../../usecases/SubmitAnswer';

/**
 * Interfaz del caso de uso: Validar la respuesta del jugador.
 */
export interface ISubmitAnswer {
  execute(
    selectedMovieId: number,
    activeMovieId: number,
    attemptsLeft: number,
    alias: string,
    activeMovie: { year: number; director: string; genre: string; cast: string[] },
  ): Promise<AnswerResult>;
}