import { GameResult } from '../entities/Game';
import { MovieRepository } from '../repositories/MovieRepository';
import { RankingRepository } from '../repositories/RankingRepository';

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
 * Responsabilidad única (SOLID - S): gestiona la lógica de validación,
 * el cálculo de puntuación, las pistas y la actualización del ranking.
 * Es el caso de uso más importante de la aplicación.
 */
export class SubmitAnswer {
  /**
   * @param movieRepository Repositorio de películas para obtener pistas.
   * @param rankingRepository Repositorio de ranking para guardar la puntuación.
   */
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly rankingRepository: RankingRepository,
  ) {}

  /**
   * Ejecuta el caso de uso: valida la respuesta y actualiza el estado de la partida.
   * @param selectedMovieId ID de TMDB de la película seleccionada por el jugador.
   * @param activeMovieId ID de TMDB de la película activa en la partida.
   * @param attemptsLeft Intentos restantes antes de esta respuesta.
   * @param alias Alias del jugador para guardar la puntuación si acierta.
   * @returns Promise con el resultado de la validación.
   */
  async execute(
    selectedMovieId: number,
    activeMovieId: number,
    attemptsLeft: number,
    alias: string,
    activeMovie: { year: number; director: string; genre: string; cast: string[] },
  ): Promise<AnswerResult> {

    const isCorrect = selectedMovieId === activeMovieId;

    if (isCorrect) {
      // Calcular puntuación: más intentos restantes = más puntos
      const score = (attemptsLeft) * 100;
      await this.rankingRepository.updateScore(alias, score);
      return { isCorrect: true, gameResult: 'win', score, hint: null };
    }

    const remainingAfter = attemptsLeft - 1;

    if (remainingAfter === 0) {
      // Sin intentos: partida perdida, puntuación 0
      return { isCorrect: false, gameResult: 'loss', score: 0, hint: null };
    }

    // Determinar qué pista mostrar según el número de fallo
    const failNumber = 5 - remainingAfter;
    const hint = this.getHint(failNumber, activeMovie);

    return { isCorrect: false, gameResult: 'playing', score: 0, hint };
  }

  /**
   * Genera la pista correspondiente al número de fallo actual.
   * @param failNumber Número de fallo (1-4).
   * @param movie Metadatos de la película activa.
   * @returns Texto de la pista o null si no hay pista disponible.
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