/**
 * Entidad principal del dominio.
 * Representa una película tal y como la usa la lógica de negocio,
 * independientemente de cómo venga de la API de TMDB.
 * No tiene dependencias externas: es TypeScript puro.
 */
export interface Movie {
  /** ID único de la película en TMDB. Se usa para validar la respuesta del jugador. */
  id: number;
  /** Título en español (obtenido con language=es-ES). Es el título que ve el jugador. */
  title: string;
  /** Título original en el idioma de producción. */
  originalTitle: string;
  /** Año de estreno. Se desvela como pista tras el primer fallo. */
  year: number;
  /** Género principal en español. Se desvela como pista tras el tercer fallo. */
  genre: string;
  /** Nombre del director. Se desvela como pista tras el segundo fallo. */
  director: string;
  /** Nombres de los 4 actores principales. Se desvelan como pista tras el cuarto fallo. */
  cast: string[];
  /** Paths de los backdrops disponibles (de /images). Se muestran progresivamente con cada fallo. */
  backdrops: string[];
}