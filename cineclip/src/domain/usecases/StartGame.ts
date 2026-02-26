import { Movie } from '../entities/Movie';
import { MovieRepository } from '../repositories/MovieRepository';

/**
 * Caso de uso: Iniciar una nueva partida.
 * Responsabilidad única (SOLID - S): solo se ocupa de obtener
 * una película aleatoria para comenzar el juego.
 * Depende de la interfaz MovieRepository, nunca de TMDB directamente.
 */
export class StartGame {
  /**
   * @param movieRepository Implementación inyectada del repositorio de películas.
   * En producción será TmdbMovieRepository, en tests un mock.
   */
  constructor(private readonly movieRepository: MovieRepository) {}

  /**
   * Ejecuta el caso de uso: obtiene una película aleatoria lista para jugar.
   * @returns Promise con la entidad Movie completa (título, backdrops, metadatos).
   */
  async execute(): Promise<Movie> {
    return await this.movieRepository.getRandomMovie();
  }
}