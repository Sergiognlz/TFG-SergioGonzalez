/**
 * Interfaz del caso de uso: Iniciar sesión.
 */
export interface ILoginUser {
  execute(alias: string, password: string): Promise<void>;
}