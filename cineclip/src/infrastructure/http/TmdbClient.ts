/**
 * Cliente HTTP configurado para la API de TMDB.
 * Centraliza la URL base, la API Key y el idioma en un único lugar.
 * Siguiendo el principio de Responsabilidad Única (SOLID - S),
 * este módulo solo se ocupa de hacer peticiones HTTP a TMDB.
 * Si cambia la URL base o el idioma, solo hay que tocar este fichero.
 */

/** URL base de la API de TMDB v3. */
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/** URL base para construir las URLs completas de los backdrops. */
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

/** Idioma de todas las peticiones. Devuelve títulos y metadatos en español. */
const LANGUAGE = 'es-ES';

/**
 * Realiza una petición GET a la API de TMDB.
 * Añade automáticamente la API Key y el idioma a todas las peticiones.
 * @param endpoint Ruta del endpoint sin la URL base. Ejemplo: '/movie/550'.
 * @param params Parámetros adicionales de la query string. Opcional.
 * @returns Promise con el JSON de la respuesta.
 * @throws Error si la petición falla o la respuesta no es correcta.
 */
export async function tmdbGet<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  // Log temporal para verificar que la API Key se lee correctamente
  console.log('API KEY:', process.env.EXPO_PUBLIC_TMDB_API_KEY);

  // Construir la query string con los parámetros adicionales
  const queryParams = new URLSearchParams({
    api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY ?? '',
    language: LANGUAGE,
    ...params,
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Error en la petición a TMDB: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}