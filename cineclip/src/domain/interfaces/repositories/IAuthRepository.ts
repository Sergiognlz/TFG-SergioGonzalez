/**
 * Interfaz del repositorio de autenticación.
 * Define el contrato que debe cumplir cualquier implementación
 * de autenticación, siguiendo el principio de Inversión de
 * Dependencias (SOLID - D).
 * La lógica de negocio nunca depende de Firebase directamente,
 * sino de esta interfaz.
 */
export interface IAuthRepository {
  /**
   * Registra un nuevo usuario con alias y contraseña.
   * Genera el email automáticamente como alias@cineclip.app.
   * @param alias Alias elegido por el jugador.
   * @param password Contraseña elegida por el jugador.
   * @throws Error si el alias ya está en uso o la contraseña no es válida.
   */
  register(alias: string, password: string): Promise<void>;

  /**
   * Inicia sesión con alias y contraseña.
   * @param alias Alias del jugador.
   * @param password Contraseña del jugador.
   * @throws Error si el alias no existe o la contraseña es incorrecta.
   */
  login(alias: string, password: string): Promise<void>;

  /**
   * Cierra la sesión del usuario actual.
   */
  logout(): Promise<void>;

  /**
   * Devuelve el alias del usuario actualmente autenticado.
   * @returns Alias del usuario o null si no hay sesión activa.
   */
  getCurrentAlias(): string | null;
}