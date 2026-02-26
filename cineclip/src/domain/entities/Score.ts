/**
 * Entidad que representa una entrada en el ranking global.
 * Se persiste en la colección /ranking/{alias} de Firebase Firestore.
 * Solo almacena la puntuación máxima alcanzada por el jugador.
 */
export interface Score {
  /** Alias del jugador. Coincide con el ID del documento en Firestore. */
  alias: string;
  /** Puntuación más alta alcanzada por el jugador. Se consulta en orden descendente para el ranking. */
  maxScore: number;
  /** Fecha de la última actualización del registro. */
  updatedAt: Date;
}