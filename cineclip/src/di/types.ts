/**
 * Tokens de identificación para las dependencias del contenedor.
 * Aunque usamos inyección manual sin librería externa, estos tokens
 * documentan claramente qué dependencias existen en el sistema
 * y sirven de referencia para futuros refactors.
 */
export const TYPES = {
  /** Repositorio de películas. Implementado por TmdbMovieRepository. */
  MovieRepository: 'MovieRepository',
  /** Repositorio de ranking y jugadores. Implementado por FirebaseRankingRepository. */
  RankingRepository: 'RankingRepository',
  /** Caso de uso: iniciar partida. */
  StartGame: 'StartGame',
  /** Caso de uso: validar respuesta del jugador. */
  SubmitAnswer: 'SubmitAnswer',
  /** Caso de uso: obtener ranking global. */
  GetRanking: 'GetRanking',
  /** Caso de uso: registrar nuevo jugador. */
  RegisterPlayer: 'RegisterPlayer',
} as const;