/**
 * Interfaz del caso de uso: Registrar un nuevo usuario con contraseña.
 */
export interface IRegisterUser {
  execute(alias: string, password: string): Promise<void>;
}