/**
 * Entidad que representa a un jugador registrado en la aplicación.
 * Se persiste en la colección /jugadores/{alias} de Firebase Firestore.
 */
export interface Player {
  /** Identificador único del jugador. Entre 3 y 20 caracteres. */
  alias: string;
  /** Puntuación acumulada en todas las partidas jugadas. */
  totalScore: number;
  /** Número total de partidas completadas. */
  gamesPlayed: number;
  /** Fecha en la que el jugador se registró por primera vez. */
  registeredAt: Date;
  /** Fecha de la última partida jugada. Null si no ha jugado ninguna todavía. */
  lastGameAt: Date | null;
}