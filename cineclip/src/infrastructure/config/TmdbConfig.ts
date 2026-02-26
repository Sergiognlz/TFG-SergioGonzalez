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
export const POPULAR_MOVIE_IDS = [
  550,    // Fight Club
  27205,  // Inception
  157336, // Interstellar
  11,     // Star Wars
  120,    // El señor de los anillos
  13,     // Forrest Gump
  155,    // El caballero oscuro
  680,    // Pulp Fiction
  238,    // El padrino
  424,    // La lista de Schindler
  389,    // 12 Angry Men
  278,    // Cadena perpetua
  19404,  // Dilwale Dulhania Le Jayenge
  372058, // Tu nombre
  129,    // El viaje de Chihiro
];