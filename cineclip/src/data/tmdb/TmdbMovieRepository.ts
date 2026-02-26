import { Movie } from '../../domain/entities/Movie';
import { IMovieRepository } from '../../domain/interfaces/repositories/IMovieRepository';
import { tmdbGet, TMDB_IMAGE_BASE_URL } from '../../infrastructure/http/tmdbClient';
import { POPULAR_MOVIE_IDS, MAX_BACKDROPS } from '../../infrastructure/config/tmdbConfig';

/**
 * Tipos auxiliares que representan la estructura raw de la respuesta de TMDB.
 * Solo incluimos los campos que necesitamos, ignoramos el resto.
 */
interface TmdbMovieResponse {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  genres: { id: number; name: string }[];
}

interface TmdbCreditsResponse {
  crew: { job: string; name: string }[];
  cast: { name: string }[];
}

interface TmdbImagesResponse {
  backdrops: { file_path: string; vote_average: number }[];
}

/**
 * Implementación concreta de MovieRepository que obtiene datos de la API de TMDB.
 * Siguiendo el principio de Inversión de Dependencias (SOLID - D),
 * la lógica de negocio nunca importa esta clase directamente,
 * sino la interfaz MovieRepository.
 */
export class TmdbMovieRepository implements IMovieRepository {

  /**
   * Obtiene una película aleatoria de la lista de populares con todos sus datos.
   * Lanza en paralelo las tres peticiones necesarias a TMDB para minimizar el tiempo de carga.
   * @returns Promise con la entidad Movie completa lista para jugar.
   */
  async getRandomMovie(): Promise<Movie> {
    // Elegir un ID aleatorio de la lista de películas populares
    const randomId = POPULAR_MOVIE_IDS[
      Math.floor(Math.random() * POPULAR_MOVIE_IDS.length)
    ];

    // Lanzar las tres peticiones en paralelo
    const [details, credits, images] = await Promise.all([
      tmdbGet<TmdbMovieResponse>(`/movie/${randomId}`),
      tmdbGet<TmdbCreditsResponse>(`/movie/${randomId}/credits`),
      tmdbGet<TmdbImagesResponse>(`/movie/${randomId}/images`, { include_image_language: 'null' }),
    ]);

    return this.mapToMovie(details, credits, images);
  }

  /**
   * Busca películas por título para el autocompletado.
   * @param query Texto introducido por el jugador (mínimo 3 caracteres).
   * @returns Promise con lista simplificada de películas para mostrar en el desplegable.
   */
  async searchMovies(query: string): Promise<Movie[]> {
    const response = await tmdbGet<{ results: TmdbMovieResponse[] }>(
      '/search/movie',
      { query },
    );

    // Mapear solo los campos necesarios para el autocompletado
    return response.results.slice(0, 8).map(movie => ({
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      year: new Date(movie.release_date).getFullYear(),
      genre: '',
      director: '',
      cast: [],
      backdrops: [],
    }));
  }

  /**
   * Transforma la respuesta raw de TMDB en la entidad Movie del dominio.
   * Centraliza toda la lógica de mapeo en un único lugar.
   * @param details Respuesta de /movie/{id}
   * @param credits Respuesta de /movie/{id}/credits
   * @param images Respuesta de /movie/{id}/images
   * @returns Entidad Movie lista para usar en la lógica de negocio.
   */
  private mapToMovie(
    details: TmdbMovieResponse,
    credits: TmdbCreditsResponse,
    images: TmdbImagesResponse,
  ): Movie {
    // Extraer el director del array de crew
    const director = credits.crew.find(m => m.job === 'Director')?.name ?? 'Desconocido';

    // Extraer los 4 primeros actores del reparto
    const cast = credits.cast.slice(0, 4).map(a => a.name);

    // Ordenar backdrops por vote_average ascendente (más ambiguos primero)
    // y construir las URLs completas
    const backdrops = images.backdrops
      .sort((a, b) => a.vote_average - b.vote_average)
      .slice(0, MAX_BACKDROPS)
      .map(b => `${TMDB_IMAGE_BASE_URL}${b.file_path}`);

    return {
      id: details.id,
      title: details.title,
      originalTitle: details.original_title,
      year: new Date(details.release_date).getFullYear(),
      genre: details.genres[0]?.name ?? 'Desconocido',
      director,
      cast,
      backdrops,
    };
  }
}