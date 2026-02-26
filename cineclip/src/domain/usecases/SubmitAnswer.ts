import { ISubmitAnswer } from '../interfaces/usecases/ISubmitAnswer';
import { IMovieRepository } from '../interfaces/repositories/IMovieRepository';
import { GameResult } from '../entities/Game';

/**
 * Resultado devuelto al validar la respuesta del jugador.
 */
export interface AnswerResult {
  /** Indica si la respuesta es correcta. */
  isCorrect: boolean;
  /** Estado de la partida tras la respuesta. */
  gameResult: GameResult;
  /** Puntuación obtenida. 0 si la respuesta es incorrecta o se agotaron los intentos. */
  score: number;
  /** Pista a mostrar si la respuesta es incorrecta. Null si es correcta o no hay más pistas. */
  hint: string | null;
}

/**
 * Caso de uso: Validar la respuesta del jugador.
 * Responsabilidad única (SOLID - S): gestiona únicamente la lógica
 * de validación, el cálculo de puntuación y las pistas.
 * La persistencia de la puntuación final se delega a SaveSessionScore,
 * reforzando el principio de Responsabilidad Única.
 * Implementa ISubmitAnswer siguiendo el principio de
 * Inversión de Dependencias (SOLID - D).
 */
export class SubmitAnswer implements ISubmitAnswer {
  /**
   * @param movieRepository Repositorio de películas. Inyectado desde el contenedor DI.
   */
  constructor(private readonly movieRepository: IMovieRepository) {}

  /**
   * Ejecuta el caso de uso: valida la respuesta y devuelve el resultado.
   * @param selectedMovieId ID de TMDB de la película seleccionada. -1 si el jugador pasa.
   * @param activeMovieId ID de TMDB de la película activa en la partida.
   * @param attemptsLeft Intentos restantes antes de esta respuesta.
   * @param alias Alias del jugador (mantenido por compatibilidad con la interfaz).
   * @param activeMovie Metadatos de la película activa para generar las pistas.
   * @returns Promise con el resultado de la validación.
   */
  async execute(
    selectedMovieId: number,
    activeMovieId: number,
    attemptsLeft: number,
    alias: string,
    activeMovie: { year: number; director: string; genre: string; cast: string[] },
  ): Promise<AnswerResult> {

    // Si el jugador pasa (-1), contar como fallo sin validar título
    if (selectedMovieId === -1) {
      const remainingAfter = attemptsLeft - 1;
      if (remainingAfter === 0) {
        return { isCorrect: false, gameResult: 'loss', score: 0, hint: null };
      }
      const failNumber = 5 - remainingAfter;
      const hint = this.getHint(failNumber, activeMovie);
      return { isCorrect: false, gameResult: 'playing', score: 0, hint };
    }

    const isCorrect = selectedMovieId === activeMovieId;

    if (isCorrect) {
      // Acierto: calcular puntuación de esta película
      // La acumulación de puntuación total se gestiona en useGame (ViewModel)
      const score = attemptsLeft * 100;
      return { isCorrect: true, gameResult: 'win', score, hint: null };
    }

    // Respuesta incorrecta: calcular intentos restantes
    const remainingAfter = attemptsLeft - 1;

    if (remainingAfter === 0) {
      // Sin intentos: game over
      return { isCorrect: false, gameResult: 'loss', score: 0, hint: null };
    }

    // Quedan intentos: devolver pista del fallo actual
    const failNumber = 5 - remainingAfter;
    const hint = this.getHint(failNumber, activeMovie);
    return { isCorrect: false, gameResult: 'playing', score: 0, hint };
  }

  /**
   * Genera la pista correspondiente al número de fallo actual.
   * @param failNumber Número de fallo (1-4).
   * @param movie Metadatos de la película activa.
   * @returns Texto de la pista o null si no corresponde pista.
   */
  private getHint(
    failNumber: number,
    movie: { year: number; director: string; genre: string; cast: string[] },
  ): string | null {
    switch (failNumber) {
      case 1: return `Año: ${movie.year}`;
      case 2: return `Director: ${movie.director}`;
      case 3: return `Género: ${movie.genre}`;
      case 4: return `Reparto: ${movie.cast.join(', ')}`;
      default: return null;
    }
  }
}