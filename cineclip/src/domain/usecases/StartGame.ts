import { IStartGame } from '../interfaces/usecases/IStartGame';
import { Movie } from '../entities/Movie';
import { IMovieRepository } from '../interfaces/repositories/IMovieRepository';

/**
 * Caso de uso: Iniciar una nueva partida.
 * Responsabilidad única (SOLID - S): solo se ocupa de obtener
 * una película aleatoria para comenzar el juego.
 * Implementa IStartGame siguiendo el principio de
 * Inversión de Dependencias (SOLID - D).
 */
export class StartGame implements IStartGame {
  /**
   * @param movieRepository Implementación inyectada del repositorio de películas.
   * En producción será TmdbMovieRepository, en tests un mock.
   */
  constructor(private readonly movieRepository: IMovieRepository) {}

  /**
   * Ejecuta el caso de uso: obtiene una película aleatoria lista para jugar.
   * @returns Promise con la entidad Movie completa (título, backdrops, metadatos).
   */
  async execute(): Promise<Movie> {
    return await this.movieRepository.getRandomMovie();
  }
}