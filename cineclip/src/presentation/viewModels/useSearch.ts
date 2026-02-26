import { useState, useCallback } from 'react';
import { Movie } from '../../domain/entities/Movie';
import { tmdbGet } from '../../infrastructure/http/tmdbClient';
import { MIN_SEARCH_CHARS } from '../../infrastructure/config/tmdbConfig';

/**
 * Hook que gestiona el autocompletado del campo de búsqueda.
 * Actúa como ViewModel del componente SearchInput.
 * Lanza una búsqueda a TMDB cuando el jugador escribe
 * al menos MIN_SEARCH_CHARS caracteres.
 */
export function useSearch() {

  /** Lista de películas sugeridas para el autocompletado. */
  const [results, setResults] = useState<Movie[]>([]);

  /** Indica si hay una búsqueda en curso. */
  const [searching, setSearching] = useState(false);

  /**
   * Busca películas por título en TMDB.
   * Solo lanza la petición si el query tiene suficientes caracteres.
   * @param query Texto introducido por el jugador.
   */
  const search = useCallback(async (query: string) => {
    // No buscar si hay menos caracteres del mínimo
    if (query.trim().length < MIN_SEARCH_CHARS) {
      setResults([]);
      return;
    }

    setSearching(true);

    try {
      const response = await tmdbGet<{
        results: {
          id: number;
          title: string;
          original_title: string;
          release_date: string;
        }[]
      }>('/search/movie', { query });

      // Mapear solo los campos necesarios para el desplegable
      const movies: Movie[] = response.results.slice(0, 8).map(m => ({
        id: m.id,
        title: m.title,
        originalTitle: m.original_title,
        year: m.release_date ? new Date(m.release_date).getFullYear() : 0,
        genre: '',
        director: '',
        cast: [],
        backdrops: [],
      }));

      setResults(movies);
    } catch (e) {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  /**
   * Limpia los resultados del autocompletado.
   * Se llama al seleccionar una película o al cancelar la búsqueda.
   */
  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    searching,
    search,
    clearResults,
  };
}