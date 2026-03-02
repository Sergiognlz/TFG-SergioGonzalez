/**
 * Configuración de la API de TMDB.
 * Centraliza todas las constantes relacionadas con TMDB.
 * La API Key se lee desde las variables de entorno para
 * no exponerla directamente en el código fuente.
 */

/**
 * Número máximo de backdrops a usar por partida.
 * Se muestran progresivamente con cada fallo (del más ambiguo al más reconocible).
 */
export const MAX_BACKDROPS = 5;

/**
 * Número mínimo de caracteres necesarios para lanzar
 * la búsqueda de autocompletado.
 */
export const MIN_SEARCH_CHARS = 3;

/**
 * IDs de películas populares en TMDB usados para
 * seleccionar una película aleatoria por partida.
 * Se pueden ampliar en el futuro.
 */
