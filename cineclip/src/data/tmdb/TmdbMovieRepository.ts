import { Movie } from '../../domain/entities/Movie';
import { IMovieRepository } from '../../domain/interfaces/repositories/IMovieRepository';
import { tmdbGet, TMDB_IMAGE_BASE_URL } from '../../infrastructure/http/tmdbClient';
import { MAX_BACKDROPS } from '../../infrastructure/config/tmdbConfig';

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

interface TmdbDiscoverResponse {
  results: { id: number }[];
  total_pages: number;
}

/**
 * Implementación concreta de MovieRepository que obtiene datos de la API de TMDB.
 * Siguiendo el principio de Inversión de Dependencias (SOLID - D),
 * la lógica de negocio nunca importa esta clase directamente,
 * sino la interfaz IMovieRepository.
 */
export class TmdbMovieRepository implements IMovieRepository {

  /**
   * Obtiene una película aleatoria de TMDB usando el endpoint /discover/movie.
   * Filtra por popularidad mínima y backdrops disponibles para garantizar
   * que las películas sean conocidas y jugables.
   * @returns Promise con la entidad Movie completa lista para jugar.
   */
  async getRandomMovie(): Promise<Movie> {
    let movie: Movie | null = null;

    // Reintentar hasta encontrar una película con suficientes backdrops
    while (!movie) {
      movie = await this.tryGetRandomMovie();
    }

    return movie;
  }

  /**
   * Intenta obtener una película aleatoria válida.
   * Devuelve null si la película no tiene suficientes backdrops para jugar.
   */
  private async tryGetRandomMovie(): Promise<Movie | null> {
    // Primera llamada para obtener el total de páginas disponibles
    const firstPage = await tmdbGet<TmdbDiscoverResponse>('/discover/movie', {
  sort_by: 'popularity.desc',
  'vote_count.gte': '500',
  'vote_average.gte': '5',
  with_original_language: 'en',
  page: '1',
});

const maxPages = Math.min(firstPage.total_pages, 100);
const randomPage = Math.floor(Math.random() * maxPages) + 1;

const page = await tmdbGet<TmdbDiscoverResponse>('/discover/movie', {
  sort_by: 'popularity.desc',
  'vote_count.gte': '500',
  'vote_average.gte': '5',
  with_original_language: 'en',
  page: randomPage.toString(),
});
    if (!page.results.length) return null;

    // Elegir una película aleatoria de la página
    const randomMovie = page.results[Math.floor(Math.random() * page.results.length)];

    // Obtener los detalles completos en paralelo
    const [details, credits, images] = await Promise.all([
      tmdbGet<TmdbMovieResponse>(`/movie/${randomMovie.id}`),
      tmdbGet<TmdbCreditsResponse>(`/movie/${randomMovie.id}/credits`),
      tmdbGet<TmdbImagesResponse>(`/movie/${randomMovie.id}/images`, {
        include_image_language: 'null',
      }),
    ]);

    // Descartar si no tiene suficientes backdrops para jugar
    if (images.backdrops.length < 3) return null;

    return this.mapToMovie(details, credits, images);
  }

  /**
   * Busca películas por título para el autocompletado.
   * @param query Texto introducido por el jugador (mínimo 3 caracteres).
   * @returns Promise con lista simplificada de películas para el desplegable.
   */
  async searchMovies(query: string): Promise<Movie[]> {
    const response = await tmdbGet<{ results: TmdbMovieResponse[] }>(
      '/search/movie',
      { query },
    );

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