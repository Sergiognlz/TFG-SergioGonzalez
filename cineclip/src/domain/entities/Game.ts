import { Movie } from './Movie';

/**
 * Estado posible de una partida:
 * - 'playing': la partida está en curso
 * - 'win': el jugador acertó antes de agotar los intentos
 * - 'loss': el jugador agotó los 5 intentos sin acertar
 */
export type GameResult = 'win' | 'loss' | 'playing';

/**
 * Entidad que representa el estado completo de una partida en curso.
 * Es el objeto central que gestiona el hook useGame (ViewModel).
 * Se persiste en /partidas/{uuid} de Firebase al finalizar.
 */
export interface Game {
  /** Película que el jugador tiene que adivinar en esta partida. */
  movie: Movie;
  /** Intentos restantes. Empieza en 5 y decrece con cada fallo. */
  attemptsLeft: number;
  /** Índice del backdrop actualmente visible (0-4). Avanza con cada fallo. */
  currentBackdropIndex: number;
  /** Pistas de metadatos ya desveladas. Se acumulan con cada fallo. */
  hintsRevealed: string[];
  /** Estado actual de la partida. */
  result: GameResult;
  /** Puntuación obtenida: (6 - intentos_usados) × 100 si win, 0 si loss. */
  score: number;
}