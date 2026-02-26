import { Movie } from '../entities/Movie';

/**
 * Contrato que define las operaciones disponibles sobre películas.
 * Siguiendo el principio de Inversión de Dependencias (SOLID - D),
 * la lógica de negocio depende de esta interfaz, nunca de la
 * implementación concreta (TmdbMovieRepository).
 * Si en el futuro se cambia TMDB por otra fuente de datos,
 * solo hay que crear una nueva implementación de esta interfaz.
 */
export interface MovieRepository {
  /**
   * Obtiene una película aleatoria con todos sus datos y backdrops.
   * @returns Promise con la entidad Movie completa lista para jugar.
   */
  getRandomMovie(): Promise<Movie>;

  /**
   * Busca películas por título para el autocompletado del campo de respuesta.
   * @param query Texto introducido por el jugador (mínimo 3 caracteres).
   * @returns Promise con lista de películas que coinciden con la búsqueda.
   */
  searchMovies(query: string): Promise<Movie[]>;
}